import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { UserService } from 'src/modules/user/user.service';
import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { ConfigService } from '@nestjs/config';
import { salt, jwtConstant } from 'src/shared/constants';

@Injectable()
export class AuthService {
    constructor (
        private configService: ConfigService,
        private mailerService: MailerService,
        private userService: UserService,
        private jwtService: JwtService,
        @InjectRepository(User) private usersRepository: Repository<User>) {}

    //Login user
    async login (loginDto: LoginDto){
        const user = await this.userService.getByUsernameOrEmail(loginDto.login)
        if (user) {
            const isMatch = await bcrypt.compare(loginDto.password, user.password);
            if (isMatch) {
                const jwtPayload = {sub: user.id, username: user.username, role: user.role};
                return { access_token: await this.jwtService.sign(jwtPayload)};
            }
        }
        throw new UnauthorizedException('Invalids credentials');
    }
    
    async forgotPassword(forgotPasswordDto: ForgotPasswordDto){
        //User exists
        const user = await this.userService.getUserByEmail(forgotPasswordDto.email);
        if (!user) {
            throw new BadRequestException('Invalid email');
        }

        //Generate reset token
        const payload = {id: user.id};
        const token = await this.jwtService.sign(payload);

        //Send link with the reset token to email
        const forgotLink = `${this.configService.get('CLIENT_APP_URL')}/auth/forgotPassword?token=${token}`;
        await this.mailerService.sendMail({
            from: this.configService.get<string>('MAIL_SENDER'),
            to: user.email,
            subject: 'Forgot Password',
            html: `
                <h3>Hello ${user.username}!</h3>
                <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
            `,
        });
        
    }

    async resetPassword(token: string, id: number, password: string) {
        //Check if reset token is valid
        const payload = await this.jwtService.verify(token, {secret: jwtConstant.secret});
        if(!payload){
            throw new BadRequestException('Password reset token expired');
        }
        const hashed = await bcrypt.hash(password, salt);
        return this.usersRepository.update({id:id}, {password: hashed});
    }

}
