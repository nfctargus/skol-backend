import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Services } from 'utils/contants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'utils/typeorm';

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers: [
        {
            provide:Services.USER,
            useClass:UserService
        }
    ],
    controllers: [UserController],
    exports:[
        {
            provide:Services.USER,
            useClass:UserService
        }
    ]
})
export class UserModule {}
