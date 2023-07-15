import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Routes, Services } from 'utils/contants';
import { IUserService } from './user';
import { AuthUser } from 'utils/decorators';
import { User } from 'utils/typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'utils/helpers';

@Controller(Routes.USER)
export class UserController {
    constructor(@Inject(Services.USER) private readonly userService: IUserService) {}

    @Get('search')
    searchUsers(@AuthUser() user:User,@Query('query') query: string) {
        if (!query) throw new HttpException('Invalid search terms', HttpStatus.BAD_REQUEST);
        return this.userService.searchUsers(user.id,query);
    }
    @Post('update')
    @UseInterceptors(FileInterceptor('avatar',multerOptions))
    updateUser(@AuthUser() user:User,@Body() data,@UploadedFile() file: Express.Multer.File) {
        return this.userService.updateUser({user,data,avatar:file})
    }
}
