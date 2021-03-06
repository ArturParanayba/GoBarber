import path from 'path';
import fs from 'fs';
import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepositories';
import User from '../infra/typeorm/entities/User';

interface IRequest {
    user_id: string;
    avatarFilename: string;
}

class UpdateUserAvatarService {
    constructor(private usersRepository: IUsersRepository) {}

    public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError(
                'Only authenticated user can chance avatar. ',
                401,
            );
        }

        if (user.avatar) {
            // Deleta o avatar anterior
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );

            // verifica se o arquivo existe
            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );

            if (userAvatarFileExists) {
                await fs.promises.unlink(userAvatarFilePath);
            }

            user.avatar = avatarFilename;

            await this.usersRepository.save(user);
        }
        return user;
    }
}

export default UpdateUserAvatarService;
