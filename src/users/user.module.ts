import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Services } from 'utils/contants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserProfile } from 'utils/typeorm';
import { ProfileService } from './profiles/user-profile.service';
import { ProfileController } from './profiles/user-profile.controller';

@Module({
    imports:[TypeOrmModule.forFeature([User,UserProfile])],
    providers: [
        {
            provide:Services.USER,
            useClass:UserService
        },
        {
            provide:Services.USER_PROFILE,
            useClass:ProfileService
        },
        
    ],
    controllers: [UserController, ProfileController],
    exports:[
        {
            provide:Services.USER,
            useClass:UserService
        },
        {
            provide:Services.USER_PROFILE,
            useClass:ProfileService
        },
    ]
})
export class UserModule {}
