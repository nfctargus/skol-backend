import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "../auth.controller";
import { UserModule } from "../../users/user.module";
import { AppModule } from "../../app.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User, UserPresence, Friend } from "../../../utils/typeorm";
import { UserController } from "../../users/user.controller";
import { Services } from "../../../utils/contants";
import { AuthService } from "../auth.service";
import { LocalStrategy } from "../utils/local.strategy";
import { SessionSerializer } from "../utils/session-serializer";

describe('AuthController', () => {
    let authController: AuthController;

    const mockRegistration = {
        "email": "sample@test.com",
        "username": "test",
        "firstName": "Test",
        "lastName": "Test",
        "password": "Test"
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: Services.AUTH,
                    useClass: AuthService
                },
            ],
            imports: [UserModule]
        }).compile();
        authController = module.get<AuthController>(AuthController);
    });

    /*  it('should be defined', () => {
         expect(authController).toBeDefined();
     }); */

});