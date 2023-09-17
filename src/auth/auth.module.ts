import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Services } from '../../utils/contants';
import { UserModule } from '../users/user.module';
import { LocalStrategy } from './utils/local.strategy';
import { SessionSerializer } from './utils/session-serializer';

@Module({
    imports: [UserModule],
    providers: [
        {
            provide: Services.AUTH,
            useClass: AuthService
        },
        LocalStrategy,
        SessionSerializer
    ],
    controllers: [AuthController],
})
export class AuthModule { }
