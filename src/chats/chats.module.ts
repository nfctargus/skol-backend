import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { Services } from 'utils/contants';
import { Chat, PrivateMessage } from 'utils/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/users/user.module';

@Module({
    imports:[TypeOrmModule.forFeature([Chat,PrivateMessage]),UserModule],
    controllers: [ChatsController],
    providers: [
        {
        provide:Services.CHAT,
        useClass:ChatsService
        }
    ],
    exports:[
        {
        provide:Services.CHAT,
        useClass:ChatsService
        }
    ],
})
export class ChatsModule {}
