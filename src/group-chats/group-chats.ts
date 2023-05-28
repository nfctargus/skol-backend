import { GroupChat } from "utils/typeorm";
import { CreateGroupChatParams, UpdateGroupChatParams } from "utils/types";

export interface IGroupChatsService {
    createGroupChat(params:CreateGroupChatParams):Promise<GroupChat>;
    getGroupChats(userId:number):Promise<GroupChat[]>;
    getGroupChatById(id:number):Promise<GroupChat>;
    save(chat: GroupChat): Promise<GroupChat>;
    getChatOnly(id: number): Promise<GroupChat>;
    update(params: UpdateGroupChatParams);
}