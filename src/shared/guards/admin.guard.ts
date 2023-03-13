import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor () {}
  canActivate(
    context: ExecutionContext,
  ){
    const req = context.switchToHttp().getRequest();
    const isAdmin = () => { return req.user.role === 'Admin'};
    return (isAdmin());
  }
}
