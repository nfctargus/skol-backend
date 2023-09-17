import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Routes, Services } from '../../utils/contants';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm';
import { IGroupMessagesService } from './group-messages';
import { EditGroupMessageDto } from './dtos/EditGroupMessage.dto';
import { CreateGroupMessageDto } from './dtos/CreateGroupMessage.dto';

@Controller(Routes.GROUP_MESSAGE)
export class GroupMessagesController {
    constructor(@Inject(Services.GROUP_MESSAGE) private readonly groupMessageService: IGroupMessagesService) { }
    @Post()
    createGroupMessage(@AuthUser() user: User, @Param('id', ParseIntPipe) id: number, @Body() { messageContent }: CreateGroupMessageDto) {
        return this.groupMessageService.createGroupMessage({ messageContent, groupChatId: id, user })
    }
    @Get()
    getGroupMessages(@AuthUser() user: User, @Param('id', ParseIntPipe) id: number) {
        return this.groupMessageService.getGroupMessages(id);
    }
    @Get(':id')
    getGroupMessageById(@AuthUser() user: User, @Param('id', ParseIntPipe) id: number) {
        return this.groupMessageService.getGroupMessageById(id);
    }
    @Patch()
    editGroupMessage(@AuthUser() user: User, @Body() { messageId, messageContent }: EditGroupMessageDto) {
        return this.groupMessageService.editGroupMessage({ user, id: messageId, messageContent })
    }
    @Delete(':id')
    async deleteGroupMessage(@AuthUser() user: User, @Param('id', ParseIntPipe) id: number) {
        await this.groupMessageService.deleteGroupMessage({ user, id });
        return { messageId: id };
    }
}
