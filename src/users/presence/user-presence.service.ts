import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { IUserPresenceService } from './user-presence';
import { UserPresence } from 'utils/typeorm/entities/UserPresence';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend, User } from 'utils/typeorm';
import { Services } from 'utils/contants';
import { IFriendsService } from 'src/friends/friends';
import { SetUserPresenceParams } from 'utils/types';

@Injectable()
export class UserPresenceService implements IUserPresenceService {
    constructor(@InjectRepository(UserPresence) private readonly userPresenceRepository:Repository<UserPresence>,
                @InjectRepository(User) private readonly userRepository:Repository<User>,
                @InjectRepository(Friend) private readonly friendRepository:Repository<Friend>) {}
    async createUserPresence(user:User) {
        const presence = await this.getUserPresence(user.id)
        if (!presence) {
            console.log("No user presence... creating")
            const presence = this.userPresenceRepository.create();
            await this.userPresenceRepository.save(presence);
            user.presence = presence;
            return this.userRepository.save(user);
        }
    }

    getUserPresence(id:number) {
        return this.userPresenceRepository.findOne({
            relations: ['user'],
            where: { user: { id } }
        });
    };
    async setUserPresence({id,presence}:SetUserPresenceParams): Promise<UserPresence> {
        const user = await this.getUserPresence(id);
        user.userPresence = presence;
        await this.userPresenceRepository.save(user);
        return this.userRepository.save(user);
    }
    async getFriendsPresence(user:User): Promise<User[]> {
        const friends = await this.friendRepository.find({
            where: [
                { userOne: user },
                { userTwo: user },
            ],
            relations: ['userOne.presence', 'userTwo.presence'],
            select: ['userOne','userTwo']
        })
        const usersFriends = []
        friends.map((friend) => friend.userOne.id === user.id ? usersFriends.push(friend.userTwo) : usersFriends.push(friend.userOne))
        return usersFriends
    }
    
}
