import { Module } from '@nestjs/common';
import { GroupMessagesController } from './group-messages.controller';
import { Services } from 'utils/contants';
import { GroupMessagesService } from './group-messages.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMessage } from 'utils/typeorm';
import { GroupChatsModule } from 'src/group-chats/group-chats.module';

@Module({
	imports:[TypeOrmModule.forFeature([GroupMessage]),GroupChatsModule],
	controllers: [GroupMessagesController],
	providers: [
		{
			provide:Services.GROUP_MESSAGE,
			useClass:GroupMessagesService
		}
	],
	exports: [
		{
			provide:Services.GROUP_MESSAGE,
			useClass:GroupMessagesService
		}
	]
})
export class GroupMessagesModule {}
