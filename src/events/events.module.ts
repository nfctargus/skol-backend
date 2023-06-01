import { Module } from '@nestjs/common';
import { Gateway } from './events.gateway';

@Module({
    providers: [Gateway],
    exports: [Gateway]
})
export class EventsModule {}
