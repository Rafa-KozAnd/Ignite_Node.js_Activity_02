import dayjs from "dayjs";

import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayJsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJsDateProvider";
import { AppError } from "@shared/errors/AppError";

import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayJDateProvider: DayJsDateProvider;

describe("Create Rental", () => {
    const dayAdd24Hours = dayjs().add(1, "day").toDate();

    beforeEach(() => {
        rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
        dayJDateProvider = new DayJsDateProvider();
        carsRepositoryInMemory = new CarsRepositoryInMemory();
        createRentalUseCase = new CreateRentalUseCase(
            rentalsRepositoryInMemory,
            dayJDateProvider,
            carsRepositoryInMemory
        );
    });
    it("Should be able to create a new rental", async () => {
        const car = await carsRepositoryInMemory.create({
            name: "Test",
            description: "Car Test",
            license_plate: "ABC-1234",
            daily_rate: 100,
            fine_amount: 50,
            category_id: "1234",
            brand: "Brand Test",
        });
        const rental = await createRentalUseCase.execute({
            car_id: car.id,
            user_id: "12345",
            expected_return_date: dayAdd24Hours,
        });
        expect(rental).toHaveProperty("id");
        expect(rental).toHaveProperty("start_date");
    });
    it("Should not be able to create a new rental if there is another open to the same user", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: "123456",
            user_id: "12345",
            expected_return_date: dayAdd24Hours,
        });

        expect(
            createRentalUseCase.execute({
                car_id: "654321",
                user_id: "12345",
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(
            new AppError("There is a rental in progress for this user!")
        );
    });
    it("Should not be able to create a new rental if there is another open to the same car", async () => {
        await rentalsRepositoryInMemory.create({
            car_id: "123456",
            user_id: "12345",
            expected_return_date: dayAdd24Hours,
        });
        await expect(
            createRentalUseCase.execute({
                car_id: "123456",
                user_id: "AAA",
                expected_return_date: dayAdd24Hours,
            })
        ).rejects.toEqual(new AppError("Car is unavailable!"));
    });
    it("Should not be able to create a new rental with invalid return time", async () => {
        expect(
            createRentalUseCase.execute({
                car_id: "121212",
                user_id: "12345",
                expected_return_date: dayjs().toDate(),
            })
        ).rejects.toEqual(new AppError("Invalid return time."));
    });
});
