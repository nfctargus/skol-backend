import { Module } from '@nestjs/common';
import { Services } from '../../utils/contants';
import { PrivateMessagesService } from './private-messages.service';
import { PrivateMessagesController } from './private-messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateMessage } from '../../utils/typeorm';
import { ChatsModule } from '../chats/chats.module';

@Module({
    imports: [TypeOrmModule.forFeature([PrivateMessage]), ChatsModule],
    controllers: [PrivateMessagesController],
    providers: [
        {
            provide: Services.PRIVATE_MESSAGE,
            useClass: PrivateMessagesService
        }
    ],
    exports: [
        {
            provide: Services.PRIVATE_MESSAGE,
            useClass: PrivateMessagesService
        }
    ],
})
export class PrivateMessagesModule { }
