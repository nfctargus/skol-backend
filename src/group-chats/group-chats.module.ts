import { Module } from '@nestjs/common';
import { GroupChatsController } from './group-chats.controller';
import { GroupChatsService } from './group-chats.service';
import { Services } from 'utils/contants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupChat, GroupMessage } from 'utils/typeorm';
import { UserModule } from 'src/users/user.module';

@Module({
	imports:[TypeOrmModule.forFeature([GroupChat,GroupMessage]),UserModule],
	controllers: [GroupChatsController],
	providers: [
		{
			provide:Services.GROUP,
			useClass:GroupChatsService
		}
	],
	exports:[
		{
			provide:Services.GROUP,
			useClass:GroupChatsService
		}
	]
})
export class GroupChatsModule {}
