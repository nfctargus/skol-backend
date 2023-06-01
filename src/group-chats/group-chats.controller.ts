import { Body, Controller, Get, Inject, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthenticatedGuard } from 'src/auth/utils/local-auth.guard';
import { Routes, Services } from 'utils/contants';
import { AuthUser } from 'utils/decorators';
import { User } from 'utils/typeorm';
import { CreateGroupChatDto } from './dtos/CreateGroupChat.dto';
import { IGroupChatsService } from './group-chats';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'utils/helpers';
import { EditGroupChatDto } from './dtos/EditGroupChat.dto';

@Controller(Routes.GROUP_CHAT)
@UseGuards(AuthenticatedGuard)
export class GroupChatsController {
    constructor(@Inject(Services.GROUP) private readonly groupChatService:IGroupChatsService) {}

    @Post()
    async createGroupChat(@AuthUser() creator:User, @Body() {name,members,message}:CreateGroupChatDto) {
        return this.groupChatService.createGroupChat({creator,name,members,message})
    }
    @Get()
    async getChats(@AuthUser() { id }: User) {
        return this.groupChatService.getGroupChats(id);
    }
    @Get(':id')
    async getChatById(@Param('id') id: number) {
        return this.groupChatService.getGroupChatById(id);
    }
    @Post(':id/avatar')
    @UseInterceptors(FileInterceptor('avatar',multerOptions))
    uploadFile(@Param('id') id: number,@AuthUser() user:User,@UploadedFile() file: Express.Multer.File) {
        return this.groupChatService.uploadOrUpdateAvatar({id,user,avatar:file});
    }
    @Post(':id/update')
    updateGroupName(@Param('id') id: number,@AuthUser() user:User,@Body() {name}:EditGroupChatDto) {
        return this.groupChatService.updateGroupName({id,user,name});
    }

}
