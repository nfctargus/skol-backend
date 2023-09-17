import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth';
import { ValidateUserCredentials } from '../../utils/types';
import { Services } from '../../utils/contants';
import { IUserService } from '../users/user';
import { compareHash } from '../../utils/helpers';

@Injectable()
export class AuthService implements IAuthService {
    constructor(@Inject(Services.USER) private readonly userService: IUserService) { }

    async validateUser(userCredentials: ValidateUserCredentials) {
        const user = await this.userService.findUser({ email: userCredentials.email });
        if (!user) throw new HttpException('Username or password is incorrect.', HttpStatus.UNAUTHORIZED);
        const isPasswordValid = await compareHash(userCredentials.password, user.password)
        return isPasswordValid ? user : null;
    }
}
