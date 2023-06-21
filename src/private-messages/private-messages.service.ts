import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IPrivateMessagesService } from './private-messages';
import { CreatePrivateMessageResponse, CreatePrivateMessageParams, EditPrivateMessageResponse, EditPrivateMessageParams, DeletePrivateMessageParams } from 'utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { PrivateMessage } from 'utils/typeorm';
import { Repository } from 'typeorm';
import { Services } from 'utils/contants';
import { IChatsService } from 'src/chats/chats';

@Injectable()
export class PrivateMessagesService implements IPrivateMessagesService {
    constructor(@InjectRepository(PrivateMessage) private readonly messageRepository:Repository<PrivateMessage>,
                @Inject(Services.CHAT) private readonly chatService:IChatsService) {}

    async createPrivateMessage({messageContent,chatId,user:author}: CreatePrivateMessageParams):Promise<CreatePrivateMessageResponse> {
        const chat = await this.chatService.getChatOnly(chatId);
        if(!chat) throw new HttpException('Chat not found',HttpStatus.BAD_REQUEST);
        const {creator,recipient} = chat;
        if(creator.id !== author.id && recipient.id !== author.id) throw new HttpException('You are not a part of this chat!',HttpStatus.UNAUTHORIZED);
        const privateMessage = this.messageRepository.create({messageContent,chat,author})
        const savedMessage = await this.messageRepository.save(privateMessage);
        chat.lastMessageSent = savedMessage;
        await this.chatService.update(chat);
        return { message:privateMessage,chat };
    };
    getPrivateMessages(id: number): Promise<PrivateMessage[]> {
        return this.messageRepository.find({
            relations: ['author','chat','author.profile'],
            where: { chat: { id } },
            order: { createdAt: 'DESC' },
        });
    }; 
    getPrivateMessageById(id: number): Promise<PrivateMessage> {
        return this.messageRepository.findOne({
            relations: ['author'],
            where: { id },
        });
    }
    async editPrivateMessage({user,id,messageContent}:EditPrivateMessageParams):Promise<EditPrivateMessageResponse> {
        const message = await this.getPrivateMessageById(id);
        if(!message) throw new HttpException('Message not found!',HttpStatus.BAD_REQUEST);
        if(message.author.id !== user.id) throw new HttpException('You cannot edit another users message!',HttpStatus.BAD_REQUEST);
        message.messageContent = messageContent;
        const newMessage = await this.messageRepository.save(message);
        return {messageId: id,message:newMessage};
    }
    async deletePrivateMessage({id,user}: DeletePrivateMessageParams) {
        const message = await this.getPrivateMessageById(id);
        if(!message) throw new HttpException('Message not found!',HttpStatus.BAD_REQUEST);
        if(message.author.id !== user.id) throw new HttpException('You cannot delete another users message!',HttpStatus.BAD_REQUEST);
        await this.messageRepository.delete(message.id);
        return {messageId: id};
    }
}
