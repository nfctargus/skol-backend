import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IUserService } from './user';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserPresence } from '../../utils/typeorm';
import { Repository } from 'typeorm';
import { CreateUserParams, FindUserParams, UpdateUserParams } from '../../utils/types';
import { hashPassword } from '../../utils/helpers';
import { IUserPresenceService } from './presence/user-presence';
import { Services } from '../../utils/contants';

@Injectable()
export class UserService implements IUserService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,
        @Inject(Services.USER_PRESENCE) private readonly userPresenceService: IUserPresenceService) { }
    async updateUser({ user, data, avatar }: UpdateUserParams): Promise<User> {
        const userExists = await this.findUser({ id: user.id });
        if (!user) throw new HttpException('Unable to find user', HttpStatus.NOT_FOUND);
        if (avatar && avatar.filename) userExists.avatar = avatar.filename;
        if (data.firstName) userExists.firstName = data.firstName;
        if (data.lastName) userExists.lastName = data.lastName;
        if (data.avatar) userExists.avatar = data.avatar;
        console.log(userExists)
        return this.userRepository.save(userExists);
    }
    async createUser(userDetails: CreateUserParams) {
        const userExists = await this.findUser({ email: userDetails.email })
        if (userExists) throw new HttpException("A user with this email address already exists.", HttpStatus.CONFLICT);
        const password = await hashPassword(userDetails.password);
        const newUser = this.userRepository.create({ ...userDetails, password });
        await this.userRepository.save(newUser);
        return this.userPresenceService.createUserPresence(newUser);
    }
    async findUser({ id, email, username }: FindUserParams): Promise<User> {
        return this.userRepository.findOne({
            where: {
                id: id,
                email: email,
                username: username
            },
            relations: { presence: true }
        });
    }
    searchUsers(userId: number, query: string) {
        const statement = '(user.email LIKE :query)';
        return this.userRepository
            .createQueryBuilder('user')
            .where(statement, { query: `%${query}%` })
            .andWhere('id != :id', { id: userId })
            .limit(10)
            .select(['user.id', 'user.firstName', 'user.lastName', 'user.email', 'user.username'])
            .getMany();
    }
}
