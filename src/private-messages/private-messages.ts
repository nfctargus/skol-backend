import { CreateMessageResponse, CreatePrivateMessageParams } from "utils/types";

export interface IPrivateMessagesService {
    createPrivateMessage(params:CreatePrivateMessageParams):Promise<CreateMessageResponse>
}