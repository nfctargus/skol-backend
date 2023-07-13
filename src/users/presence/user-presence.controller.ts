import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Routes, Services } from 'utils/contants';
import { IUserPresenceService } from './user-presence';
import { AuthUser } from 'utils/decorators';
import { User } from 'utils/typeorm';
import { EditUserPresenceDto } from './dtos/EditUserPresence.dto';

@Controller(Routes.USER_PRESENCE)
export class UserPresenceController {
    constructor(@Inject(Services.USER_PRESENCE) private readonly userPresenceService:IUserPresenceService) {}
    @Get(':id')
    async getUserPresence(@Param('id') id:number) {
        return this.userPresenceService.getUserPresence(id);
    }
    @Get()
    async getAllFriendsPresence(@AuthUser() user:User) {
        return this.userPresenceService.getFriendsPresence(user);
    }
    @Post()
    async setUserPresence(@AuthUser() user:User,@Body() {presence}:EditUserPresenceDto) {
        return this.userPresenceService.setUserPresence({id:user.id,presence});
    }
    @Post('/create')
    async createUserPresence(@AuthUser() user:User) {
        return this.userPresenceService.createUserPresence(user); 
    }
    
}
