import { PrivateMessage } from "utils/typeorm";
import { CreatePrivateMessageResponse, CreatePrivateMessageParams, EditPrivateMessageResponse, EditPrivateMessageParams, DeletePrivateMessageParams } from "utils/types";

export interface IPrivateMessagesService {
    createPrivateMessage(params:CreatePrivateMessageParams):Promise<CreatePrivateMessageResponse>;
    getPrivateMessages(id: number): Promise<PrivateMessage[]>;
    getPrivateMessageById(id:number):Promise<PrivateMessage>;
    editPrivateMessage(params:EditPrivateMessageParams):Promise<EditPrivateMessageResponse>
    deletePrivateMessage(params:DeletePrivateMessageParams);
}