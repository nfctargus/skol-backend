import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IChatsService } from './chats';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, PrivateMessage } from 'utils/typeorm';
import { Repository } from 'typeorm';
import { Services } from 'utils/contants';
import { IUserService } from 'src/users/user';
import { CreateChatParams, FindOrCreateChatParams, UpdateChatParams } from 'utils/types';

@Injectable()
export class ChatsService implements IChatsService {
    constructor(@InjectRepository(Chat) private readonly chatRepository:Repository<Chat>,
                @Inject(Services.USER) private readonly userService:IUserService,
                @InjectRepository(PrivateMessage) private readonly messageRepository:Repository<PrivateMessage>) {}

    async createChat(params:CreateChatParams):Promise<Chat> {
        const {user:creator,email,message:messageContent} = params;
        const recipient = await this.userService.findUser({ email })
        if (!recipient) throw new HttpException('Recipient not found', HttpStatus.BAD_REQUEST);
        const exists = await this.findChatByUserId(creator.id,recipient.id);
        if(exists) throw new HttpException('This chat already exists', HttpStatus.CONFLICT);
        const chat = this.chatRepository.create({creator,recipient});
        const savedChat = await this.save(chat);
        if(messageContent) {
            const privateMessage = this.messageRepository.create({messageContent,chat,author:creator})
            const savedMessage = await this.messageRepository.save(privateMessage);
            await this.update({id:savedChat.id,lastMessageSent:savedMessage});
        }
        
        return savedChat;
    };
    async getChats(id:number):Promise<Chat[]> {
        return this.chatRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.creator','creator')
        .leftJoinAndSelect('chat.recipient','recipient')
        .leftJoinAndSelect('chat.messages','messages')
        .where('creator.id = :id', { id })
        .orWhere('recipient.id = :id', { id })
        .leftJoinAndSelect('chat.lastMessageSent','lastMessageSent')
        .orderBy('chat.lastMessageSentAt','DESC')
        .getMany()
    };
    async getChatById(id: number): Promise<Chat> {
        return this.chatRepository.findOne({where: [{id}],relations: ['creator','recipient','messages','messages.author','lastMessageSent']});
    };
    async findChatByUserId(userOneId: number, userTwoId: number):Promise<Chat> {
        return this.chatRepository.findOne({
            where: [
              {
                creator: { id: userOneId },
                recipient: { id: userTwoId },
              },
              {
                creator: { id: userTwoId },
                recipient: { id: userOneId },
              },
            ],
        });
    };
    save(chat: Chat): Promise<Chat> {
        return this.chatRepository.save(chat);
    } 
    async getChatOnly(id:number):Promise<Chat> {
        return this.chatRepository.findOne({where: [{id}],relations: ['creator','recipient']});
    }
    update({ id, lastMessageSent }:UpdateChatParams) {
        return this.chatRepository.update(id, { lastMessageSent });
    }
    async findOrCreateChat({user,email}: FindOrCreateChatParams): Promise<Chat> {
        const friend = await this.userService.findUser({ email })
        if (!friend) throw new HttpException('Friend not found', HttpStatus.BAD_REQUEST);
        const exists = await this.findChatByUserId(user.id,friend.id);
        if(exists) return exists;
        return this.createChat({user,email});
    }
}
