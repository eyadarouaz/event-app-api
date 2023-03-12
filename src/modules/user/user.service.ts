import { UpdatePasswordDto } from './dto/update-password.dto';
import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { RegisterDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { salt } from 'src/shared/constants';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>) {}

    //Create a new user
    async createUser(registerDto: RegisterDto) {
        try {
            const userEmailCheck = await this.getUserByEmail(registerDto.email)
            const userUsernameCheck = await this.getUserByUsername(registerDto.username);
            if (userEmailCheck) {
                throw new ConflictException(
                `User with email: '${registerDto.email}' already exists`,
                );
            }if (userUsernameCheck){ 
                throw new ConflictException(
                    `User with username: '${registerDto.username}' already exists`,
                );
            }
            const hashPassword = await bcrypt.hash(registerDto.password, salt);
            const user = this.usersRepository.create({...registerDto, password: hashPassword});
            await this.usersRepository.save(user);
            return user;
        } catch (error) {
            if (error.status === HttpStatus.CONFLICT) {
                throw error;
            } else {
                throw new HttpException(
                error.message,
                HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    //Update user info (username?,email?,password?)
    async updateUser(id: number, updateDto: UpdateUserDto) {
        const usernameCheck = await this.getUserByUsername(updateDto.username);
        if(usernameCheck){
            throw new ConflictException(
                `User with username: '${updateDto.username}' already exists`,
            );
        }
        return await this.usersRepository.update({id:id}, {...updateDto}); 
    }

    //Update profile (firstName?,lastName?,mobile?..)
    async updateProfile(id: number, updateDto: UpdateProfileDto, ) {
        try {
            return await this.usersRepository.update({id:id}, {...updateDto});
        }catch {
            throw new HttpException("User was not updated", HttpStatus.INTERNAL_SERVER_ERROR);
        }
            
    }

   //Change password
    async changePassword(id: number, passwordDto: UpdatePasswordDto) {
        const user = await this.getUserById(id);
        if(user){
            const isMatch = await bcrypt.compare(passwordDto.currentPassword, user.password);
            if(isMatch) {
                const hashPassword = await bcrypt.hash(passwordDto.newPassword, salt);
                return await this.usersRepository.update({id:id}, {password: hashPassword});
            }
        }
        throw new UnauthorizedException('Incorrect password');
    }

    //Update profile picture
    async updatePhoto(id: number, fileName: string ){
        try {
            return await this.usersRepository.update({id:id}, {profileImage: fileName});
        }catch(err) {
            throw new HttpException("Cannot update photo", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUser(id: number) {
        try{
            return await this.usersRepository.delete({id: id});
        }catch {
            throw new HttpException("Cannot delete user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //Getters
    async getAllUsers() {
        return this.usersRepository.find();
    }

    async getUserByEmail(email: string): Promise<User> {
        return await this.usersRepository.findOne({ where: { email: email } });
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.usersRepository.findOne({ where: { username: username } });
    }

    async getByUsernameOrEmail(usernameOrEmail: string) {
       let user = await this.getUserByUsername(usernameOrEmail);
       if (!user){
        user = await this.getUserByEmail(usernameOrEmail);
       }
       return user;
    }

    async getProfile (id: number) {
        const profile = await this.usersRepository.findOneBy({id: id});
        return {firstName: profile.firstName, lastName: profile.lastName, 
            email: profile.email, mobile: profile.mobile, birthday: profile.birthday}
    }
    
    async getUserById(id: number): Promise<User> {
        return await this.usersRepository.findOne({ where: { id: id } });
    }

}
