import { Body, Controller, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Routes, Services } from 'utils/contants';
import { IPrivateMessagesService } from './private-messages';
import { AuthUser } from 'utils/decorators';
import { User } from 'utils/typeorm';

@Controller(Routes.PRIVATE_MESSAGE)
export class PrivateMessagesController {
    constructor(@Inject(Services.PRIVATE_MESSAGE) private readonly messageService:IPrivateMessagesService) {}

    @Post()
    createPrivateMessage(@AuthUser() user: User,@Param('id', ParseIntPipe) id: number,@Body() messageContent:string) {
        return this.messageService.createPrivateMessage({messageContent,chatId:id,user})
    }
}
