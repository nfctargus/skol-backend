import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Routes, Services } from 'utils/contants';
import { IPrivateMessagesService } from './private-messages';
import { AuthUser } from 'utils/decorators';
import { User } from 'utils/typeorm';
import { CreatePrivateMessageDto } from './dtos/CreatePrivateMessage.dto';
import { EditPrivateMessageDto } from './dtos/EditPrivateMessage.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.PRIVATE_MESSAGE)
export class PrivateMessagesController {
    constructor(@Inject(Services.PRIVATE_MESSAGE) private readonly messageService:IPrivateMessagesService,
    private eventEmitter: EventEmitter2) {}

    @Post()
    async createPrivateMessage(@AuthUser() user: User,@Param('id', ParseIntPipe) id: number,@Body() {messageContent}:CreatePrivateMessageDto) {
        const message = await this.messageService.createPrivateMessage({messageContent,chatId:id,user});
        this.eventEmitter.emit('privateMessages-create', message);
        return message;
    }
    @Get()
    getPrivateMessages(@AuthUser() user: User,@Param('id', ParseIntPipe) id: number) {
        return this.messageService.getPrivateMessages(id);
    }
    @Get(':id')
    getPrivateMessageById(@AuthUser() user:User,@Param('id',ParseIntPipe) id:number) {
        return this.messageService.getPrivateMessageById(id);
    }
    @Patch()
    editPrivateMessage(@AuthUser() user:User,@Body() {messageId,messageContent}:EditPrivateMessageDto) {
        return this.messageService.editPrivateMessage({user,id:messageId,messageContent})
    }
    @Delete(':id')
    deletePrivateMessage(@AuthUser() user:User,@Param('id',ParseIntPipe) id:number) {
        return this.messageService.deletePrivateMessage({user,id});
    }
}
