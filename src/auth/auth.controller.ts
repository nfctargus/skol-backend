import { Body, Controller, Get, HttpStatus, Inject, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Routes, Services } from 'utils/contants';
import { IAuthService } from './auth';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { IUserService } from 'src/users/user';
import { instanceToPlain } from 'class-transformer';
import { AuthenticatedGuard, LocalAuthGuard } from './utils/local-auth.guard';
import {Request, Response} from 'express';

@Controller(Routes.AUTH)
export class AuthController {
    constructor(@Inject(Services.AUTH) private authService:IAuthService,@Inject(Services.USER) private userService:IUserService) {}

    @Post('register')
    async userRegister(@Body() createUserDto:CreateUserDto) {
        console.log("Incoming user registration... Email: " + createUserDto.email);
        return instanceToPlain(await this.userService.createUser(createUserDto));
    }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    userLogin(@Req() req:Request,@Res() res:Response) {
        res.send(HttpStatus.OK)
    }
    @Get('status')
    @UseGuards(AuthenticatedGuard)
    authStatus(@Req() req:Request,@Res() res:Response) {
        res.send(req.user);
    }
    @Post('logout')
    @UseGuards(AuthenticatedGuard)
    logout(@Req() req: Request, @Res() res: Response) {
        req.logout((err) => {
        return err ? res.send(400) : res.send(200);
        });
    }
}
