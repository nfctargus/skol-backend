import { Controller, Get, Inject,Patch,Post,UploadedFile,UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Routes, Services } from 'utils/contants';
import { IUserProfileService } from './user-profiles';
import { AuthUser } from 'utils/decorators';

import { User } from 'utils/typeorm';
import { multerOptions } from 'utils/helpers';

@Controller(Routes.USER_PROFILE)
export class ProfileController {
    constructor(@Inject(Services.USER_PROFILE) private readonly userProfileService:IUserProfileService) {}

    @Post()
    @UseInterceptors(FileInterceptor('avatar',multerOptions))
    uploadFile(@AuthUser() user:User,@UploadedFile() file: Express.Multer.File) {
        return this.userProfileService.createProfile({user,avatar:file});
    }
    @Get()
    getUserProfile(@AuthUser() user:User) {
        return this.userProfileService.getUserProfile(user);
    }
}
