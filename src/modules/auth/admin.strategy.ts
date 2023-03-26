import { ForbiddenException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstant } from 'src/shared/constants';
import { UserService } from '../user/user.service';
import { strategies } from 'src/shared/constants';

@Injectable()
export class AdminStrategy extends PassportStrategy( Strategy, strategies.admin ) {
  constructor(
    private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstant.secret,
    });
  }

  async validate(payload: any) {
    // Find user by id | email | etc
    const user  = this.userService.getUserById(payload.id);
    if (!user) {
      throw new UnauthorizedException();
    } 
    else {
      if (payload.role != "Admin") {throw new ForbiddenException();}
    }
    return user;
  }
}