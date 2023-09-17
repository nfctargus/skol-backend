import { User } from "../../utils/typeorm";
import { CreateUserParams, FindUserParams, UpdateUserParams } from "../../utils/types";

export interface IUserService {
    createUser(userDetails: CreateUserParams): Promise<User>;
    findUser(findUserParams: FindUserParams): Promise<User>;
    searchUsers(userId: number, query: string): Promise<User[]>;
    updateUser(params: UpdateUserParams): Promise<User>;
}