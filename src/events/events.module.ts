import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { Services } from 'utils/contants';
import { SessionStore } from './sessionStore';
import { ChatsModule } from 'src/chats/chats.module';
import { GroupChatsModule } from 'src/group-chats/group-chats.module';
import { UserModule } from 'src/users/user.module';


@Module({
    imports:[ChatsModule,GroupChatsModule,UserModule],
    providers: [
        EventsGateway,
        {
            provide:Services.GATEWAY_SESSION_STORE,
            useClass:SessionStore
        }
    ],
    exports: [EventsGateway]
})
export class EventsModule {}
