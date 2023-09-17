import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "../user.service"
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../../../utils/typeorm";
import { Services } from "../../../utils/contants";
import { Repository } from "typeorm";
import * as bcryptUtils from '../../../utils/helpers';

describe('UserService', () => {
    let userService: UserService;
    let repository: Repository<User>;

    const userRepositoryToken = getRepositoryToken(User);
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: userRepositoryToken,
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOne: jest.fn(),
                        createQueryBuilder: jest.fn(),
                    }
                },
                {
                    provide: Services.USER_PRESENCE,
                    useValue: {
                        createUserPresence: jest.fn(),
                        getUserPresence: jest.fn(),
                        setUserPresence: jest.fn(),
                        getFriendsPresence: jest.fn(),
                    }
                }
            ],
        }).compile();
        userService = module.get<UserService>(UserService);
        repository = module.get<Repository<User>>(userRepositoryToken);
    });
    it('should be defined', () => {
        expect(userService).toBeDefined();
    })
    it('repository should be defined', () => {
        expect(repository).toBeDefined();
    })
    describe('createUser', () => {
        jest.spyOn(bcryptUtils, 'hashPassword').mockReturnValue(Promise.resolve('hashed123'))
        it('should hash the password correctly', async () => {
            await userService.createUser({
                email: 'test@test.com',
                username: 'test',
                firstName: 'Test',
                lastName: 'Test',
                password: '123'
            });
            expect(bcryptUtils.hashPassword).toHaveBeenCalledWith('123')
        });
        it('should create the user entity with the hashed password', async () => {

            await userService.createUser({
                email: 'test@test.com',
                username: 'test',
                firstName: 'Test',
                lastName: 'Test',
                password: '123'
            });
            expect(repository.save).toHaveBeenCalledWith({
                email: 'test@test.com',
                username: 'test',
                firstName: 'Test',
                lastName: 'Test',
                password: 'hashed123'
            })
        });

    })
})