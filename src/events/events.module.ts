import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { Services } from 'utils/contants';
import { SessionStore } from './sessionStore';

@Module({
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
