import { User } from "./typeorm";

export type CreateUserParams = {
    email:string;
    firstName:string;
    lastName:string;
    username:string;
    password:string;
}
export type ValidateUserCredentials = {
    email:string;
    password:string;
}
export type FindUserParams = Partial<{
    id: number;
    email:string;
    username:string;
}>
export interface AuthenticatedRequest extends Request {
    user: User;
} 
export type AddFriendParams = {
    user: User;
    userId: number;
};
export type DeleteFriendParams = {
    id:number;
    friendId:number;
}