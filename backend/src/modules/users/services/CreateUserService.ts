import { hash } from 'bcryptjs';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepositories';

import User from '../infra/typeorm/entities/User';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    constructor(private usersRepository: IUsersRepository) {}

    public async execute({ name, email, password }: IRequest): Promise<User> {
        const checkUserExist = await this.usersRepository.findByEmail(email);

        if (checkUserExist) {
            throw new AppError('Email adress already used');
        }

        const hashedPassword = await hash(password, 8);

        const user = await this.usersRepository.create({
            name,
            email,
            password: hashedPassword,
        });

        return user;
    }
}

export default CreateUserService;
