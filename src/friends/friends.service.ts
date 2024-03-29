import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IFriendsService } from './friends';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddFriendParams, DeleteFriendParams } from '../../utils/types';
import { Services } from '../../utils/contants';
import { IUserService } from '../users/user';
import { Friend } from '../../utils/typeorm/entities/Friend';
import { User } from '../../utils/typeorm';

@Injectable()
export class FriendsService implements IFriendsService {
    constructor(@InjectRepository(Friend) private readonly friendRepository: Repository<Friend>,
        @Inject(Services.USER) private readonly userService: IUserService) { }
    async addFriend({ user, email }: AddFriendParams): Promise<Friend> {
        const userTwo = await this.userService.findUser({ email })
        if (!userTwo) throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
        const friends = await this.isFriends(user.id, userTwo.id);
        if (friends) throw new HttpException("Already friends", HttpStatus.CONFLICT);
        const newFriend = await this.friendRepository.create({ userOne: user, userTwo })
        return this.friendRepository.save(newFriend);
    }
    async deleteFriend({ id, friendId }: DeleteFriendParams) {
        const friends = await this.isFriends(id, friendId)
        if (!friends) throw new HttpException("You are not friends with this user.", HttpStatus.BAD_REQUEST);
        await this.friendRepository.delete({ id: friends.id });

        return { id: friendId, friendId: friends.id }
    }
    getFriends(user: User): Promise<Friend[]> {
        return this.friendRepository.find({
            where: [
                { userOne: user },
                { userTwo: user },
            ],
            relations: ['userOne', 'userTwo']
        })
    }
    findFriendById(id: number): Promise<Friend> {
        return this.friendRepository.findOne({ where: { id }, relations: ['userOne', 'userTwo'] });
    }
    isFriends(userOneId: number, userTwoId: number): Promise<Friend> {
        return this.friendRepository.findOne({
            where: [
                {
                    userOne: { id: userOneId },
                    userTwo: { id: userTwoId },
                },
                {
                    userOne: { id: userTwoId },
                    userTwo: { id: userOneId },
                },
            ],
        });
    }
}
