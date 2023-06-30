import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Services } from 'utils/contants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend, User, UserPresence, UserProfile } from 'utils/typeorm';
import { ProfileService } from './profiles/user-profile.service';
import { ProfileController } from './profiles/user-profile.controller';
import { UserPresenceController } from './presence/user-presence.controller';
import { UserPresenceService } from './presence/user-presence.service';

@Module({
    imports:[
        TypeOrmModule.forFeature([User,UserProfile,UserPresence,Friend]),
    ],
    providers: [
        {
            provide:Services.USER,
            useClass:UserService
        },
        {
            provide:Services.USER_PROFILE,
            useClass:ProfileService
        },
        {
            provide:Services.USER_PRESENCE,
            useClass:UserPresenceService
        },  
    ],
    controllers: [UserController, ProfileController, UserPresenceController],
    exports:[
        {
            provide:Services.USER,
            useClass:UserService
        },
        {
            provide:Services.USER_PROFILE,
            useClass:ProfileService
        },
        {
            provide:Services.USER_PRESENCE,
            useClass:UserPresenceService
        },  
    ]
})
export class UserModule {}
