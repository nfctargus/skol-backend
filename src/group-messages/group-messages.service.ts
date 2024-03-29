import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IGroupChatsService } from '../group-chats/group-chats';
import { Repository } from 'typeorm';
import { Services } from '../../utils/contants';
import { GroupMessage } from '../../utils/typeorm';
import { IGroupMessagesService } from './group-messages';
import { CreateGroupMessageParams, CreateGroupMessageResponse, DeleteGroupMessageParams, EditGroupMessageParams, EditGroupMessageResponse } from '../../utils/types';

@Injectable()
export class GroupMessagesService implements IGroupMessagesService {
    constructor(@InjectRepository(GroupMessage) private readonly groupMessageRepository: Repository<GroupMessage>,
        @Inject(Services.GROUP) private readonly groupChatService: IGroupChatsService) { }

    async createGroupMessage({ messageContent, groupChatId, user: author }: CreateGroupMessageParams): Promise<CreateGroupMessageResponse> {
        const groupChat = await this.groupChatService.getGroupChatById(groupChatId);
        if (!groupChat) throw new HttpException('Group chat not found', HttpStatus.BAD_REQUEST);
        if (!groupChat.members.find((member) => member.id === author.id)) throw new HttpException('You are not a part of this group chat', HttpStatus.BAD_REQUEST);
        const groupMessage = this.groupMessageRepository.create({ messageContent, groupChat, author });
        const savedMessage = await this.groupMessageRepository.save(groupMessage);
        groupChat.lastMessageSent = savedMessage;
        const updatedChat = await this.groupChatService.update(groupChat);
        const savedGroupMessage = await this.getGroupMessageById(groupMessage.id);
        return { message: savedGroupMessage, chat: updatedChat };
    }
    getGroupMessages(id: number): Promise<GroupMessage[]> {
        return this.groupMessageRepository.find({
            relations: ['author', 'groupChat'],
            where: { groupChat: { id } },
            order: { createdAt: 'DESC' },
        });
    }
    getGroupMessageById(id: number): Promise<GroupMessage> {
        return this.groupMessageRepository.findOne({
            relations: ['author', 'groupChat.creator', 'groupChat.lastMessageSent', 'groupChat.members'],
            where: { id },
        });
    }
    async editGroupMessage({ user, id, messageContent }: EditGroupMessageParams): Promise<EditGroupMessageResponse> {
        const groupMessage = await this.getGroupMessageById(id);
        if (!groupMessage) throw new HttpException('Group message not found', HttpStatus.BAD_REQUEST);
        if (groupMessage.author.id !== user.id) throw new HttpException('You cannot edit another users message!', HttpStatus.BAD_REQUEST);
        groupMessage.messageContent = messageContent;
        const newGroupMessage = await this.groupMessageRepository.save(groupMessage);
        const updatedChat = await this.groupChatService.getGroupChatById(newGroupMessage.groupChat.id);
        return { messageId: id, message: newGroupMessage, updatedChat };
    }
    async deleteGroupMessage({ id, user }: DeleteGroupMessageParams) {

        const groupMessage = await this.getGroupMessageById(id);
        const { groupChat } = groupMessage;
        console.log(groupMessage.author.id !== user.id)
        console.log(groupChat.creator)
        if (!groupMessage) throw new HttpException('Group message not found', HttpStatus.BAD_REQUEST);

        if (groupChat.creator.id !== user.id) {
            if (groupMessage.author.id !== user.id) throw new HttpException('Only the message author or group owner can delete messages!', HttpStatus.BAD_REQUEST);
        }

        if (groupChat.lastMessageSent.id !== id) {
            await this.groupMessageRepository.delete(id);
        } else {
            const group = await this.groupChatService.getGroupChatById(groupChat.id);
            if (group.messages.length <= 1) {
                await this.groupChatService.update({ id: groupChat.id, lastMessageSent: null });
                return this.groupMessageRepository.delete({ id });
            } else if (group.messages.length === 2) {
                const newLastMessage = group.messages[0];
                await this.groupChatService.update({ id: groupChat.id, lastMessageSent: newLastMessage });
                return this.groupMessageRepository.delete({ id });
            }
            else {
                const newLastMessage = group.messages[1];
                await this.groupChatService.update({ id: groupChat.id, lastMessageSent: newLastMessage });
                return this.groupMessageRepository.delete({ id });
            }
        }
    }
}
