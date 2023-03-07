import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register-user.dto';
import { Role } from 'src/shared/role.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
    constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>) {}

    //CRUD
    async createUser(registerDto: RegisterDto): Promise<User> {
        try{
            const user = this.usersRepository.create(registerDto);
            await this.usersRepository.save(user);
            return user;
        }catch {
            throw new HttpException("User was not created", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updateProfile(id: number, updateDto: UpdateProfileDto, ) {
        try {const toUpdate = await this.getUserById(id);
            const updatedDate = new Date().toJSON();
            const updated = Object.assign(toUpdate, updateDto);
            await this.usersRepository.save(updated);
            return  await this.usersRepository.update({id:id}, {updatedAt: updatedDate});
        }catch {
            throw new HttpException("User was not updated", HttpStatus.INTERNAL_SERVER_ERROR);
        }
            
    }

    async makeAdmin(id: number){
        try{
            return await this.usersRepository.update({id:id}, {role: Role.ADMIN});
        }catch{
            throw new HttpException("User role was not updated", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async updatePhoto(id: number, fileName: string ){
        try {
            const updatedDate = new Date().toJSON();
            return await this.usersRepository.update({id:id}, {profileImage: fileName, updatedAt: updatedDate});
        }catch(err) {
            throw new HttpException("Photo was not updated", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteUser(id: number) {
        try{
            return await this.usersRepository.delete({id: id});
        }catch {
            throw new HttpException("User was not deleted", HttpStatus.INTERNAL_SERVER_ERROR);
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
    
    async getUserById(id: number): Promise<User> {
        return await this.usersRepository.findOne({ where: { id: id } });
    }

}
