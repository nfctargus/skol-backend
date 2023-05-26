import { Chat } from "utils/typeorm";
import { CreateChatParams } from "utils/types";

export interface IChatsService {
    createChat(params:CreateChatParams):Promise<Chat>;
    getChats(id:number):Promise<Chat[]>;
    getChatById(id:number):Promise<Chat>;
    save(chat: Chat): Promise<Chat>;
    getChatOnly(id: number): Promise<Chat>;
}