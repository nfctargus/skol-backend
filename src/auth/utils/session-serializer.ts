import { Inject } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { IUserService } from "src/users/user";
import { Services } from "utils/contants";
import { User } from "utils/typeorm";

export class SessionSerializer extends PassportSerializer {
    constructor(@Inject(Services.USER) private readonly userService:IUserService){ super(); }

    serializeUser(user: User, done: (err,user:User) => void) {
        done(null,user);
    }
    async deserializeUser(user: User, done: (err,user:User) => void) {
        const userDb = await this.userService.findUser({id:user.id});
        return userDb ? done(null,userDb) : done(null,null);
    }
    
}