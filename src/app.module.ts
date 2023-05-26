import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from 'utils/typeorm';
import { PassportModule } from '@nestjs/passport';
import { FriendsController } from './friends/friends.controller';
import { FriendsService } from './friends/friends.service';
import { FriendsModule } from './friends/friends.module';
import { ChatsModule } from './chats/chats.module';
import { PrivateMessagesService } from './private-messages/private-messages.service';
import { PrivateMessagesController } from './private-messages/private-messages.controller';
import { PrivateMessagesModule } from './private-messages/private-messages.module';


@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env.development'}),
        AuthModule,
        UserModule, 
        FriendsModule,
        PassportModule.register({ session: true }),
        TypeOrmModule.forRoot({
            type:'mysql',
            host: process.env.MYSQL_DB_HOST,
            port:process.env.MYSQL_DB_PORT,
            username:process.env.MYSQL_DB_USERNAME,
            password:process.env.MYSQL_DB_PASSWORD,
            database:process.env.MYSQL_DB_NAME,
            entities,
            synchronize:true,
        }),
        ChatsModule,
        PrivateMessagesModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
