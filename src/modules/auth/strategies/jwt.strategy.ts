import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';

import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger;
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
    this.logger = new Logger(JwtStrategy.name);
  }

  public async validate(payload: JwtPayload): Promise<User> {
    try {
      const user = await this.authService.validateUser(payload);
      if (!user.token) {
        return null;
      }
      const refreshTokenExpirationDate = DateTime.fromJSDate(user.token.lastActivity)
        .setZone('UTC')
        .plus({ second: Number(process.env.REFRESH_TOKEN_EXPIRES_IN_SECONDS) });

      if (DateTime.local().setZone('UTC') >= refreshTokenExpirationDate) {
        await this.authService.logout(payload);
        return null;
      }
      await this.authService.updateToken(user.token.id, {
        lastActivity: DateTime.local().setZone('UTC').toISO(),
      });
      return user;
    } catch (e) {
      this.logger.error(`Error occurs while checking token expiration: ${e.message}`);
      return null;
    }
  }
}
