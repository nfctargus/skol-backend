import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Routes, Services } from 'utils/contants';
import { IPrivateMessagesService } from './private-messages';
import { AuthUser } from 'utils/decorators';
import { User } from 'utils/typeorm';
import { CreatePrivateMessageParams } from 'utils/types';
import { CreatePrivateMessageDto } from './dtos/CreatePrivateMessage.dto';

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
}
