import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from '../utils/typeorm';
import { PassportModule } from '@nestjs/passport';
import { FriendsModule } from './friends/friends.module';
import { ChatsModule } from './chats/chats.module';
import { PrivateMessagesModule } from './private-messages/private-messages.module';
import { GroupChatsModule } from './group-chats/group-chats.module';
import { GroupMessagesModule } from './group-messages/group-messages.module';
import { EventsModule } from './events/events.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.development' }),
        AuthModule,
        UserModule,
        FriendsModule,
        PassportModule.register({ session: true }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_DB_HOST,
            port: process.env.MYSQL_DB_PORT,
            username: process.env.MYSQL_DB_USERNAME,
            password: process.env.MYSQL_DB_PASSWORD,
            database: process.env.MYSQL_DB_NAME,
            entities,
            synchronize: true,
        }),
        ChatsModule,
        PrivateMessagesModule,
        GroupChatsModule,
        GroupMessagesModule,
        EventsModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
