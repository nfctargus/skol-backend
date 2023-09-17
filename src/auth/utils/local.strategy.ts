import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { Services } from '../../../utils/contants';
import { IAuthService } from '../auth';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(Services.AUTH) private readonly authService: IAuthService) {
        super({ usernameField: 'email' });
    }
    async validate(email: string, password: string) {
        return this.authService.validateUser({ email, password });
    }
}
