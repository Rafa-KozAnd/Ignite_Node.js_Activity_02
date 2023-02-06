import { ICreateRentalDTO } from "../dtos/ICreateRentalsDTO";
import { Rental } from "../infra/entities/Rental";

interface IRentalsRepository {
    findById(id: string): Promise<Rental>;
    findOpenRentalByCar(car_id: string): Promise<Rental>;
    findOpenRentalByUser(user_id: string): Promise<Rental>;
    create(data: ICreateRentalDTO): Promise<Rental>;
    findByUser(user_id: string): Promise<Rental[]>;
}

export { IRentalsRepository };
