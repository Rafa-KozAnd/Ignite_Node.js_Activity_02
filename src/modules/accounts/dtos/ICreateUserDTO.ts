interface ICreateUserDTO {
    name: string;
    email: string;
    driver_license: string;
    password: string;
    id?: string;
    avatar?: string;
}

export { ICreateUserDTO };
