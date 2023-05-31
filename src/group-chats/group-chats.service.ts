import { Inject, Injectable } from '@nestjs/common';
import { IGroupChatsService } from './group-chats';
import { GroupChat, GroupMessage } from 'utils/typeorm';
import { CreateGroupChatParams, UpdateGroupChatParams } from 'utils/types';
import { Services } from 'utils/contants';
import { IUserService } from 'src/users/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GroupChatsService implements IGroupChatsService {
    constructor(@Inject(Services.USER) private readonly userService:IUserService,
                @InjectRepository(GroupChat) private readonly groupChatRepository:Repository<GroupChat>,
                @InjectRepository(GroupMessage) private readonly groupMessageRepository:Repository<GroupMessage>) {}
    async createGroupChat(params: CreateGroupChatParams): Promise<GroupChat> {
        const { name,creator,message:messageContent } = params;
        const membersPromise = params.members.map((member) => this.userService.findUser({email:member}) )
        const members = (await Promise.all(membersPromise));
        members.push(creator);
        const groupChat = this.groupChatRepository.create({name,creator,members})
        console.log(groupChat)
        const savedChat = await this.groupChatRepository.save(groupChat);
        if(messageContent) {
            const groupMessage = this.groupMessageRepository.create({messageContent,groupChat,author:creator})
            const savedMessage = await this.groupMessageRepository.save(groupMessage);
            await this.update({id:savedChat.id,lastMessageSent:savedMessage});
        }
        
        return this.getGroupChatById(savedChat.id);
    }
    getGroupChats(id: number): Promise<GroupChat[]> {
        return this.groupChatRepository
        .createQueryBuilder('groupChat')
        .leftJoinAndSelect('groupChat.members','member')
        .leftJoinAndSelect('groupChat.messages','messages')
        .where('member.id IN (:members)', { members: id })
        .leftJoinAndSelect('groupChat.members','members')
        .leftJoinAndSelect('groupChat.lastMessageSent','lastMessageSent')
        .leftJoinAndSelect('groupChat.creator','creator')
        .orderBy('groupChat.lastMessageSentAt','DESC')
        .getMany()
    }
    getGroupChatById(id: number): Promise<GroupChat> {
        return this.groupChatRepository.findOne({where: [{id}],relations: ['creator','members','messages','messages.author','lastMessageSent']});
    }
    save(chat: GroupChat): Promise<GroupChat> {
        return this.groupChatRepository.save(chat);
    }
    getChatOnly(id: number): Promise<GroupChat> {
        throw new Error('Method not implemented.');
    }
    update({id,lastMessageSent}: UpdateGroupChatParams) {
        return this.groupChatRepository.update(id,{lastMessageSent});
    }
}
