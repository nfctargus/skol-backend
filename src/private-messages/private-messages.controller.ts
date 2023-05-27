import { Body, Controller, Get, Inject, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Routes, Services } from 'utils/contants';
import { IPrivateMessagesService } from './private-messages';
import { AuthUser } from 'utils/decorators';
import { User } from 'utils/typeorm';
import { CreatePrivateMessageParams } from 'utils/types';
import { CreatePrivateMessageDto } from './dtos/CreatePrivateMessage.dto';
import { EditPrivateMessageDto } from './dtos/EditPrivateMessage.dto';

@Controller(Routes.PRIVATE_MESSAGE)
export class PrivateMessagesController {
    constructor(@Inject(Services.PRIVATE_MESSAGE) private readonly messageService:IPrivateMessagesService) {}

    @Post()
    createPrivateMessage(@AuthUser() user: User,@Param('id', ParseIntPipe) id: number,@Body() {messageContent}:CreatePrivateMessageDto) {
        console.log(messageContent)
        return this.messageService.createPrivateMessage({messageContent,chatId:id,user})
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
    editPrivateMessage(@AuthUser() user:User,@Body() {id,messageContent}:EditPrivateMessageDto) {
        return this.messageService.editPrivateMessage({user,id,messageContent})
    }
}
