import { GroupMessage } from "../../utils/typeorm";
import { CreateGroupMessageParams, CreateGroupMessageResponse, DeleteGroupMessageParams, EditGroupMessageParams, EditGroupMessageResponse } from "../../utils/types";

export interface IGroupMessagesService {
    createGroupMessage(params: CreateGroupMessageParams): Promise<CreateGroupMessageResponse>;
    getGroupMessages(id: number): Promise<GroupMessage[]>;
    getGroupMessageById(id: number): Promise<GroupMessage>;
    editGroupMessage(params: EditGroupMessageParams): Promise<EditGroupMessageResponse>;
    deleteGroupMessage(params: DeleteGroupMessageParams);
}