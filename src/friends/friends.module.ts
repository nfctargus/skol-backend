import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsController } from './friends.controller';
import { Services } from 'utils/contants';
import { FriendsService } from './friends.service';
import { UserModule } from 'src/users/user.module';
import { Friend } from 'utils/typeorm/entities/Friend';


@Module({
    imports:[TypeOrmModule.forFeature([Friend]),UserModule],
    providers: [
        {
            provide:Services.FRIEND,
            useClass:FriendsService
        }
    ],
    controllers: [FriendsController],
    exports:[
        {
            provide:Services.FRIEND,
            useClass:FriendsService
        }
    ]
})
export class FriendsModule {
    
}
