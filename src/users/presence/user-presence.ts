import { User } from "../../../utils/typeorm";
import { UserPresence } from "../../../utils/typeorm/entities/UserPresence";
import { SetUserPresenceParams } from "../../../utils/types";

export interface IUserPresenceService {
    getUserPresence(id: number): Promise<UserPresence>;
    setUserPresence(params: SetUserPresenceParams): Promise<UserPresence>;
    getFriendsPresence(user: User): Promise<User[]>;
    createUserPresence(user: User);
}