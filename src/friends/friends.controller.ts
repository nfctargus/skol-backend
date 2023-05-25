import { Controller, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Routes, Services } from 'utils/contants';
import { AuthUser } from 'utils/decorators';
import { User } from 'utils/typeorm';
import { IFriendsService } from './friends';

@Controller(Routes.FRIEND)
export class FriendsController {
    constructor(@Inject(Services.FRIEND) private readonly friendService:IFriendsService) {}
    @Post(':id')
    addFriend(@AuthUser() user:User,@Param('id',ParseIntPipe) userId:number) {
        return this.friendService.addFriend({user,userId})
    }
    @Get()
    getFriends(@AuthUser() user:User) {
        return this.friendService.getFriends(user);
    }
    @Get(':id')
    getFriendById(@Param('id',ParseIntPipe) id:number) {
        return this.friendService.findFriendById(id);
    }
}
