import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, CreateUserProfileParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    ){}

    findUsers(){
        return this.userRepository.find( {relations: ['profile']});
    }

    createUser(userDetails: CreateUserParams) {
        console.log('User details:', userDetails);
        const newUser = this.userRepository.create({ 
            ...userDetails,
             data_criacao: new Date,
            });
            return this.userRepository.save(newUser);
    }

    updateUser(id: number, updateUserDetails: UpdateUserParams){
        return this.userRepository.update({ id }, { ...updateUserDetails });
    }

    deleteUser(id: number,){
        return this.userRepository.delete({ id })
    }

    async createUserProfile(id: number, createUserProfileDetails: CreateUserProfileParams){
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new HttpException('User not found. Cannot create Profile', HttpStatus.BAD_REQUEST);

        const newProfile = this.profileRepository.create({
            ...createUserProfileDetails,
            username: user.username,
            authStrategy: user.authStrategy
        });
        const savedProfile = await this.profileRepository.save(newProfile);
        return savedProfile;
    }
}
