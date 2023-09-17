import { User } from '../../utils/typeorm';
import { Friend } from '../../utils/typeorm/entities/Friend';
import { AddFriendParams, DeleteFriendParams } from '../../utils/types';

export interface IFriendsService {
    addFriend(params: AddFriendParams): Promise<Friend>;
    deleteFriend(params: DeleteFriendParams);
    getFriends(user: User): Promise<Friend[]>;
    findFriendById(id: number): Promise<Friend>;
    isFriends(userOneId: number, userTwoId: number): Promise<Friend | undefined>;
}