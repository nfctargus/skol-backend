import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IChatsService } from './chats';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat, PrivateMessage } from 'utils/typeorm';
import { Repository } from 'typeorm';
import { Services } from 'utils/contants';
import { IUserService } from 'src/users/user';
import { CreateChatParams } from 'utils/types';

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
        const savedChat = await this.chatRepository.save(chat);
        const privateMessage = this.messageRepository.create({messageContent,chat,author:creator})
        await this.messageRepository.save(privateMessage);
        return savedChat;
    };
    async getChats(id:number):Promise<Chat[]> {
        return this.chatRepository
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.creator','creator')
        .leftJoinAndSelect('chat.recipient','recipient')
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
}
