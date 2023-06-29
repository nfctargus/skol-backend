import { User } from "utils/typeorm";
import { CreateUserParams, FindUserParams } from "utils/types";

export interface IUserService {
    createUser(userDetails:CreateUserParams):Promise<User>;
    findUser(findUserParams:FindUserParams):Promise<User>;
    searchUsers(userId:number,query:string):Promise<User[]>;
    getUserPresence(userId:number);
    updateUserPresence(userId:number,presence:string);
}