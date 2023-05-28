import { MailerService } from '@nestjs-modules/mailer/dist';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as random from 'random-string-generator';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { jwtConstant, salt } from 'src/shared/constants';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  //Login user
  async login(loginDto: LoginDto) {
    const user = await this.userService.getByUsernameOrEmail(loginDto.login);
    if (user) {
      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (isMatch) {
        const jwtPayload = { user };
        // const refreshToken = await this.jwtService.sign(jwtPayload, {expiresIn: '168h'});
        const accessToken = await this.jwtService.sign(jwtPayload, {
          expiresIn: '2h',
        });
        // const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);
        // this.usersRepository.update({id: user.id}, {refreshToken: hashedRefreshToken})
        // return { access_token: accessToken, refresh_token: refreshToken };
        return { access_token: accessToken };
      }
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async createAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      const payload = await this.verifyToken(refreshToken);
      if (!payload) {
        throw new Error();
      }
      const user = await this.userService.getUserById(payload.user.id);
      console.log(user);
      if (!user) {
        throw new HttpException(
          'User with this id does not exist',
          HttpStatus.NOT_FOUND,
        );
      }
      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.refreshToken,
      );
      console.log(isRefreshTokenMatching);
      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid token');
      }
      const accessToken = await this.jwtService.sign(
        { user },
        { expiresIn: '900s' },
      );
      return { access_token: accessToken };
    } catch {
      throw new UnauthorizedException('Invalid');
    }
  }

  async removeRefreshToken(login: string) {
    const user = await this.userService.getByUsernameOrEmail(login);
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return this.usersRepository.update(
      { id: user.id },
      {
        refreshToken: null,
      },
    );
  }

  async verifyToken(token: any) {
    const payload = await this.jwtService.verify(token, {
      secret: jwtConstant.secret,
    });
    return payload;
  }

  async forgotPassword(email: string) {
    try {
      //User exists
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new BadRequestException('Invalid email');
      }
      //Generate reset token
      const payload = { id: user.id };
      const token = await this.jwtService.sign(payload, { expiresIn: '300s' });
      const verifCode = random('lowernumeric');
      await this.usersRepository.update(
        { id: payload.id },
        { resetCode: verifCode },
      );
      // Send link with the reset token to email
      const forgotLink = `${this.configService.get('CLIENT_APP_URL')}
            /reset-password?verifycode=${verifCode}&token=${token}`;

      await this.mailerService.sendMail({
        from: this.configService.get<string>('MAIL_SENDER'),
        to: user.email,
        subject: 'Forgot Password',
        html: `
                    <h3>Hello ${user.username}!</h3>
                    <p>Please use this <a href="${forgotLink}">link</a> to reset your password.</p>
                `,
      });
      return { token: token, verif_code: verifCode };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(token: string, verifCode: string, password: string) {
    const payload = await this.jwtService.verify(token, {
      secret: jwtConstant.secret,
    });
    if (payload) {
      const user = await this.usersRepository.findOne({
        where: {
          id: payload.id,
          resetCode: verifCode,
        },
      });
      if (user) {
        const hashed = await bcrypt.hash(password, salt);
        return this.usersRepository.update(
          { id: payload.id },
          { password: hashed, resetCode: null },
        );
      }
      throw new ForbiddenException();
    }
  }
}
