import { Chat, GroupChat, GroupMessage, PrivateMessage, User } from "./typeorm";
import { Message } from "./typeorm/entities/Message";

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
    email: string;
};
export type DeleteFriendParams = {
    id:number;
    friendId:number;
}
export type CreateChatParams = {
    user:User;
    email:string;
    message?:string;
}
export type CreatePrivateMessageParams = {
    messageContent:string;
    chatId:number;
    user:User;
}
export type CreateGroupMessageParams = {
    messageContent:string;
    groupChatId:number;
    user:User;
}
export type CreatePrivateMessageResponse = {
    message:PrivateMessage;
    chat:Chat;
}
export type CreateGroupMessageResponse = {
    message:GroupMessage;
    chat:GroupChat;
}
export type EditPrivateMessageResponse = {
    messageId:number;
    message:PrivateMessage;
}
export type EditGroupMessageResponse = {
    messageId:number;
    message:GroupMessage;
}
export type UpdateChatParams = {
    id:number;
    lastMessageSent:PrivateMessage;
}
export type FindOrCreateChatParams = {
    user:User;
    email:string;
}
export type UpdateGroupChatParams = {
    id:number;
    lastMessageSent:GroupMessage;
}
export type EditPrivateMessageParams = {
    user:User;
    id:number;
    messageContent:string;
}
export type EditGroupMessageParams = {
    user:User;
    id:number;
    messageContent:string;
}
export type CreateGroupChatParams = {
    name?:string;
    creator:User;
    members:string[];
    message:string;
}
export type CreateUserProfileParams = {
    user:User;
    avatar?:Express.Multer.File;
}
export type AddAvatarGroupChatParams = {
    id:number;
    user:User;
    avatar?:Express.Multer.File;
}
export type UpdateGroupChatNameParams = {
    user:User;
    id:number;
    name:string;
}
export type DeletePrivateMessageParams = {
    user:User;
    id:number;
}