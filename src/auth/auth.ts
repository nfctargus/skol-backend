import { User } from "utils/typeorm";
import { ValidateUserCredentials } from "utils/types";

export interface IAuthService {
    validateUser(credentials:ValidateUserCredentials):Promise<User | null>;
}