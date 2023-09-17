import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Routes, Services } from '../../utils/contants';
import { AuthUser } from '../../utils/decorators';
import { User } from '../../utils/typeorm';
import { IFriendsService } from './friends';
import { AddFriendDto } from './dtos/AddFriend.dto';

@Controller(Routes.FRIEND)
export class FriendsController {
    constructor(@Inject(Services.FRIEND) private readonly friendService: IFriendsService) { }
    @Post()
    addFriend(@AuthUser() user: User, @Body() { email }: AddFriendDto) {
        return this.friendService.addFriend({ user, email });
    }
    @Get()
    getFriends(@AuthUser() user: User) {
        return this.friendService.getFriends(user);
    }
    @Get(':id')
    getFriendById(@Param('id', ParseIntPipe) id: number) {
        return this.friendService.findFriendById(id);
    }
    @Delete(':id')
    deleteFriendById(@AuthUser() { id }: User, @Param('id', ParseIntPipe) friendId: number) {
        return this.friendService.deleteFriend({ id, friendId });
    }
}
