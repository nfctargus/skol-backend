import { User } from "utils/typeorm";
import { UserPresence } from "utils/typeorm/entities/UserPresence";

export interface IUserPresenceService {
    getUserPresence(id:number):Promise<UserPresence>;
    setUserPresence(id:number,presence:string):Promise<UserPresence>;
    getFriendsPresence(user:User):Promise<User[]>;
    createUserPresence(user:User);
}