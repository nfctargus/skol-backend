import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IGroupChatsService } from './group-chats';
import { GroupChat, GroupMessage } from 'utils/typeorm';
import { AddAvatarGroupChatParams, CreateGroupChatParams, ModifyGroupChatMemberParams, UpdateGroupChatNameParams, UpdateGroupChatParams } from 'utils/types';
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
    async update({id,lastMessageSent}: UpdateGroupChatParams) {
        await this.groupChatRepository.update(id,{lastMessageSent});
        return this.getGroupChatById(id);
    }
    async uploadOrUpdateAvatar({id,user,avatar}: AddAvatarGroupChatParams): Promise<GroupChat> {
        const group = await this.getGroupChatById(id);
        if(!group) throw new HttpException('Group not found',HttpStatus.BAD_REQUEST);
        if(group.creator.id !== user.id) throw new HttpException('Only the group creator can upload an avatar',HttpStatus.UNAUTHORIZED);
        group.avatar = avatar.filename
        return this.groupChatRepository.save(group);
    }
    async updateGroupName({id,user,name}: UpdateGroupChatNameParams): Promise<GroupChat> {
        const group = await this.getGroupChatById(id);
        if(!group) throw new HttpException('Group not found',HttpStatus.BAD_REQUEST);
        if(group.creator.id !== user.id) throw new HttpException('Only the group creator can change the group name',HttpStatus.UNAUTHORIZED);
        group.name = name;
        return this.groupChatRepository.save(group);
    }
    async removeGroupChatUser({groupId,userId,user}:ModifyGroupChatMemberParams):Promise<GroupChat> {
        const groupChat = await this.getGroupChatById(groupId);
        if(groupChat.creator.id === userId) throw new HttpException('You cannot remove the group creator from the group',HttpStatus.BAD_REQUEST);
        if(groupChat.creator.id !== user.id) throw new HttpException('Only the group owner can remove other members',HttpStatus.BAD_REQUEST);
        if(groupChat.members.length <= 2)throw new HttpException('Group minimum size has been reached.',HttpStatus.BAD_REQUEST);
        const updatedMembers = groupChat.members.filter((member) => member.id !== userId);
        groupChat.members = updatedMembers;
        return this.groupChatRepository.save(groupChat);
    }
    async addGroupChatUser({groupId,users,user}:ModifyGroupChatMemberParams):Promise<GroupChat> {
        const groupChat = await this.getGroupChatById(groupId);
        if(groupChat.creator.id !== user.id) throw new HttpException('Only the group owner can add members',HttpStatus.BAD_REQUEST);
        const userPromise = users.map((user) => {
            if(groupChat.members.find((member) => member.id === user)) throw new HttpException('User is already in this group',HttpStatus.BAD_REQUEST);
            return this.userService.findUser({id:user});
        });
        (await Promise.all(userPromise)).map((user) => groupChat.members.push(user))
        return this.groupChatRepository.save(groupChat);
    }
}
