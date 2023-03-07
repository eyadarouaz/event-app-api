import { ResetPasswordDto } from './dto/update-password.dto';
import { Repository } from 'typeorm';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterDto } from './dto/register-user.dto';
import { UserService } from 'src/user/user.service';
import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor (private userService: UserService,
        private jwtService: JwtService,
        @InjectRepository(User) private usersRepository: Repository<User>) {}


    //Add a new user
    async registerUser(registerDto: RegisterDto) {
        try {
            const userEmailCheck = await this.userService.getUserByEmail(registerDto.email)
            const userUsernameCheck = await this.userService.getUserByUsername(registerDto.username);
            if (userEmailCheck) {
                throw new ConflictException(
                `User with email: '${registerDto.email}' already exists`,
                );
            }if (userUsernameCheck){ 
                throw new ConflictException(
                    `User with username: '${registerDto.username}' already exists`,
                );
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(registerDto.password, salt);

            const user = await this.userService.createUser({
                ...registerDto,
                password: hashPassword,
            });
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

    //Validate user and Login
    async validateUser (usernameOrEmail: string, password: string){
        const user = await this.userService.getByUsernameOrEmail(usernameOrEmail)
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const jwtPayload = {sub: user.id, username: user.username, role: user.role};
                await this.usersRepository.update({id:user.id}, {isActive: true});
                return { access_token: await this.jwtService.sign(jwtPayload)};
            }
        }
        throw new UnauthorizedException('Invalids credentials');
        } catch (error) {
        if (error.status === HttpStatus.UNAUTHORIZED) {
            throw error;
        } else {
            throw new HttpException(
            error.message,
            HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    //Reset password
    async changePassword(id: number, passwordDto: ResetPasswordDto) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(passwordDto.password, salt);
        return await this.usersRepository.update({id:id}, {password: hashPassword});
    }
}






    // }

    // async loginUser (registerDTO: RegisterUserDto) {
    //     const {username, password} = registerDTO;

    //     const user = await this.userRepository.findOneBy({username});
    //     if (!user) {
    //         throw new UnauthorizedException('Invalid credentials.');
    //     }

    //     const isPasswordMatch = await user.password === password;
    //     if (isPasswordMatch) {
    //         const jwtPayload = {username};
    //         return { access_token: await this.jwtService.signAsync(jwtPayload)};


    //     }else{
    //         throw new UnauthorizedException('Invalid credentials.');
    //     }

    // }