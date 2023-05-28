import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IGroupChatsService } from 'src/group-chats/group-chats';
import { Repository } from 'typeorm';
import { Services } from 'utils/contants';
import { GroupMessage } from 'utils/typeorm';
import { IGroupMessagesService } from './group-messages';
import { CreateGroupMessageParams, CreateGroupMessageResponse, EditGroupMessageParams, EditGroupMessageResponse } from 'utils/types';

@Injectable()
export class GroupMessagesService implements IGroupMessagesService {
    constructor(@InjectRepository(GroupMessage) private readonly groupMessageRepository:Repository<GroupMessage>,
                @Inject(Services.GROUP) private readonly groupChatService:IGroupChatsService) {}

    async createGroupMessage({messageContent,groupChatId,user:author}: CreateGroupMessageParams): Promise<CreateGroupMessageResponse> {
        const groupChat = await this.groupChatService.getGroupChatById(groupChatId);
        if(!groupChat) throw new HttpException('Group chat not found',HttpStatus.BAD_REQUEST);
        if(!groupChat.members.find((member) => member.id === author.id)) throw new HttpException('You are not a part of this group chat',HttpStatus.BAD_REQUEST);
        const groupMessage = this.groupMessageRepository.create({messageContent,groupChat,author});
        const savedMessage = await this.groupMessageRepository.save(groupMessage);
        groupChat.lastMessageSent = savedMessage;
        const updatedChat = await this.groupChatService.update(groupChat);
        return { message:groupMessage,chat:updatedChat };
    }
    getGroupMessages(id: number): Promise<GroupMessage[]> {
        return this.groupMessageRepository.find({
            relations: ['author'],
            where: { groupChat: { id } },
            order: { createdAt: 'DESC' },
        });
    }
    getGroupMessageById(id: number): Promise<GroupMessage> {
        return this.groupMessageRepository.findOne({
            relations: ['author'],
            where: { id },
        });
    }
    async editGroupMessage({user,id,messageContent}: EditGroupMessageParams): Promise<EditGroupMessageResponse> {
        const groupMessage = await this.getGroupMessageById(id);
        if(!groupMessage) throw new HttpException('Group message not found',HttpStatus.BAD_REQUEST);
        if(groupMessage.author.id !== user.id) throw new HttpException('You cannot edit another users message!',HttpStatus.BAD_REQUEST);
        groupMessage.messageContent = messageContent;
        const newGroupMessage = await this.groupMessageRepository.save(groupMessage);
        return {messageId:id,message:newGroupMessage};
    }

                
}
