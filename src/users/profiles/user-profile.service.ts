import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserProfile } from 'utils/typeorm';
import { IUserProfileService } from './user-profiles';
import { CreateUserProfileParams } from 'utils/types';
import { UploadedFile } from "express-fileupload";

@Injectable()
export class ProfileService implements IUserProfileService{
    constructor(@InjectRepository(UserProfile) private readonly userProfileRepository:Repository<UserProfile>,
                @InjectRepository(User) private readonly userRepository: Repository<User>) {}
    
    updateProfile({user,avatar}:CreateUserProfileParams) {
        throw new Error('Method not implemented.'); 
    }

    async createProfile({user,avatar}:CreateUserProfileParams) { 
        const profile = await this.getUserProfile(user)
        if (!profile) {
            console.log("No profile... creating")
            const profile = this.userProfileRepository.create();
            if(avatar) profile.avatar = avatar.filename
            await this.userProfileRepository.save(profile);
            user.profile = profile;
            return this.userRepository.save(user);
        }
    }
    getUserProfile({id}:User) {
        return this.userProfileRepository.findOne({
            relations: ['user'],
            where: { user: { id } }
        });
    };
}
