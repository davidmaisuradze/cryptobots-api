import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { UserNotActiveException } from '../../../exceptions/user.not.active.exception';

@Injectable()
export class JwtAuthActiveOnlyGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  public handleRequest(err: Error, user): any {
    if (err || !user) {
      throw err || new UnauthorizedException('Access token is invalid or expired');
    }
    if (!user.isActive) {
      throw new UserNotActiveException('You are not able to make requests until your account is not activated!');
    }

    return user;
  }
}
