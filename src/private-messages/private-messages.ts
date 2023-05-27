import { PrivateMessage } from "utils/typeorm";
import { CreateMessageResponse, CreatePrivateMessageParams, EditPrivateMessageParams } from "utils/types";

export interface IPrivateMessagesService {
    createPrivateMessage(params:CreatePrivateMessageParams):Promise<CreateMessageResponse>;
    getPrivateMessages(id: number): Promise<PrivateMessage[]>;
    getPrivateMessageById(id:number):Promise<PrivateMessage>;
    editPrivateMessage(params:EditPrivateMessageParams):Promise<PrivateMessage>
}