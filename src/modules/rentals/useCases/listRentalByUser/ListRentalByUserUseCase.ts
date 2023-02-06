import { inject, injectable } from "tsyringe";

import { RentalsRepository } from "@modules/rentals/infra/repositories/RentalsRepository";

@injectable()
class ListRentalByUserUseCase {
    constructor(
        @inject("RentalsRepository")
        private rentalsRepository: RentalsRepository
    ) {}
    async execute(user_id: string) {
        const rentalsByUser = await this.rentalsRepository.findByUser(user_id);

        return rentalsByUser;
    }
}

export { ListRentalByUserUseCase };
