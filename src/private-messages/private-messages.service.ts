import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IPrivateMessagesService } from './private-messages';
import { CreateMessageResponse, CreatePrivateMessageParams } from 'utils/types';
import { InjectRepository } from '@nestjs/typeorm';
import { PrivateMessage } from 'utils/typeorm';
import { Repository } from 'typeorm';
import { Services } from 'utils/contants';
import { IChatsService } from 'src/chats/chats';

@Injectable()
export class PrivateMessagesService implements IPrivateMessagesService {
    constructor(@InjectRepository(PrivateMessage) private readonly messageRepository:Repository<PrivateMessage>,
                @Inject(Services.CHAT) private readonly chatService:IChatsService) {}
    async createPrivateMessage({messageContent,chatId,user:author}: CreatePrivateMessageParams):Promise<CreateMessageResponse> {
        const chat = await this.chatService.getChatOnly(chatId);
        if(!chat) throw new HttpException('Chat not found',HttpStatus.BAD_REQUEST);
        const {creator,recipient} = chat;
        if(creator.id !== author.id && recipient.id !== author.id) throw new HttpException('You are not a part of this chat!',HttpStatus.UNAUTHORIZED);
        const privateMessage = this.messageRepository.create({messageContent,chat,author})
        const savedMessage = await this.messageRepository.save(privateMessage);
        chat.lastMessageSent = savedMessage;
        const updatedChat = await this.chatService.save(chat);
        return { message:privateMessage,chat:updatedChat };
    }
    getPrivateMessages(id: number): Promise<PrivateMessage[]> {
        return this.messageRepository.find({
            relations: ['author'],
            where: { chat: { id } },
            order: { createdAt: 'DESC' },
        });
    }    
}
