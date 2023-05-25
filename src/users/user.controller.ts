import { Controller, Get, HttpException, HttpStatus, Inject, Query } from '@nestjs/common';
import { Routes, Services } from 'utils/contants';
import { IUserService } from './user';
import { AuthUser } from 'utils/decorators';
import { User } from 'utils/typeorm';

@Controller(Routes.USER)
export class UserController {
    constructor(@Inject(Services.USER) private readonly userService: IUserService) {}

    @Get('search')
    searchUsers(@AuthUser() user:User,@Query('query') query: string) {
        if (!query) throw new HttpException('Invalid search terms', HttpStatus.BAD_REQUEST);
        return this.userService.searchUsers(user.id,query);
    }

}
