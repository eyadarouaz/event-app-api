import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { RegisterDto } from 'src/auth/dto/register-user.dto';
import { Role } from 'src/shared/role.enum';
import { UpdateInfoDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>) {}

    //CRUD
    async createUser(registerDto: RegisterDto): Promise<User> {
        const user = this.usersRepository.create(registerDto);
        await this.usersRepository.save(user);
        return user;
    }

    async updateInfo(id: number, updateDto: UpdateInfoDto, ) {
        const toUpdate = await this.getUserById(id);
        const updated = Object.assign(toUpdate, updateDto);
        return await this.usersRepository.save(updated);
    }

    async hashing (password: string){
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword;
    }

    async deleteUser(id: number) {
        return await this.usersRepository.delete({id: id});
    }

    //Getters
    async getAllUsers() {
        return this.usersRepository.find();
    }

    getRole(user: User): Role[] {
        return user.role;
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
