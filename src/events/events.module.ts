import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { Services } from '../../utils/contants';
import { SessionStore } from './sessionStore';
import { ChatsModule } from '../chats/chats.module';
import { GroupChatsModule } from '../group-chats/group-chats.module';
import { UserModule } from '../users/user.module';


@Module({
    imports: [ChatsModule, GroupChatsModule, UserModule],
    providers: [
        EventsGateway,
        {
            provide: Services.GATEWAY_SESSION_STORE,
            useClass: SessionStore
        }
    ],
    exports: [EventsGateway]
})
export class EventsModule { }
