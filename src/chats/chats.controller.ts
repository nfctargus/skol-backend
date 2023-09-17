import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { AuthenticatedGuard } from '../auth/utils/local-auth.guard';
import { Routes, Services } from '../../utils/contants';
import { IChatsService } from './chats';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm';
import { CreateChatDto } from './dtos/CreateChat.dto';
import { FindOrCreateChat } from './dtos/FindOrCreateChat.dto';

@Controller(Routes.CHAT)
@UseGuards(AuthenticatedGuard)
export class ChatsController {
    constructor(@Inject(Services.CHAT) private readonly chatsService: IChatsService) { }

    @Post()
    async createChat(@AuthUser() user: User, @Body() { email, message }: CreateChatDto) {
        return this.chatsService.createChat({ user, email, message });
    }
    @Get()
    async getChats(@AuthUser() { id }: User) {
        return this.chatsService.getChats(id);
    }
    @Get(':id')
    async getChatById(@Param('id') id: number) {
        return this.chatsService.getChatById(id);
    }
    @Post('/find')
    async findOrCreateChat(@AuthUser() user: User, @Body() { email }: FindOrCreateChat) {
        console.log(email)
        return this.chatsService.findOrCreateChat({ user, email });
    }
}
