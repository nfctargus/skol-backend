import { User } from "utils/typeorm";
import { CreateUserProfileParams } from "utils/types";

export interface IUserProfileService {
    createProfile(params:CreateUserProfileParams);
    updateProfile(params:CreateUserProfileParams);
    getUserProfile(user:User);
}