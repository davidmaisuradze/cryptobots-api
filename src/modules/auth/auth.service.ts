import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { inspect } from 'util';
import zxcvbn from 'zxcvbn';
import { DateTime } from 'luxon';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthTokenDto, AuthLoginDto, AuthRegisterDto, AuthRefreshTokenDto, AuthResetPasswordRequestDto, AuthUpdatePasswordDto, AuthResetPasswordDto } from './dto';
import { AuthTokenUpdateDto } from './dto/auth.token.update.dto';
import { AuthToken } from './entities/auth.token.entity';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { InvalidPasswordException } from './exceptions';
import { passwordPattern } from '../../constants/patterns';
import { ResetPasswordRequest } from './entities/reset.password.request.entity';

@Injectable()
export class AuthService {
  private readonly logger: Logger;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
    @InjectRepository(ResetPasswordRequest)
    private readonly passwordResetRepository: Repository<ResetPasswordRequest>,
  ) {
    this.logger = new Logger(AuthService.name);
  }

  async register(userDto: AuthRegisterDto) {
    const { firstName, lastName, email, password } = userDto;

    const user = await this.usersService.findOneByEmail(email);
    if(user) {
      throw new Error('User already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await this.usersService.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    delete newUser.password;

    return newUser;
  }

  async login(loginDto: AuthLoginDto) {
    const { email: loginEmail, password } = loginDto;

    const user = await this.usersService.checkIfUserExists(loginEmail);

    if (!await bcrypt.compare(password, user.password)) {
      throw new BadRequestException('invalid credentials');
    }

    const authToken = await this.createTokensPair({
      email: loginEmail,
    });

    const { accessToken, refreshToken } = authToken;
    const token = this.createAuthToken(accessToken, refreshToken);
    const { email, firstName, lastName } = await this.usersService.update(user.email, {
      token,
    });

    return {
      email,
      firstName,
      lastName,
      token,
    };
  }

  public async refreshUserToken(refreshTokenDto: AuthRefreshTokenDto): Promise<User> {
    try {
      const user = await this.usersService.findOneByRefreshToken(refreshTokenDto.refreshToken);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const refreshTokenExpirationDate = DateTime.fromJSDate(user.token.lastActivity)
        .setZone('UTC')
        .plus({ second: Number(this.configService.get('REFRESH_TOKEN_EXPIRES_IN_SECONDS')) });
      if (DateTime.local().setZone('UTC') >= refreshTokenExpirationDate) {
        await this.logout(user.email);
        throw new UnauthorizedException('Refresh token expired');
      }

      return await this.createOrUpdateToken(user);
    } catch (e) {
      this.logger.error(`Error happened during refreshing user token: ${String(e.message)}`);
      throw new UnauthorizedException('Refresh token failed');
    }
  }

  public async resetPasswordRequest(resetPasswordRequest: AuthResetPasswordRequestDto): Promise<{
    message: string;
    errors: any[];
  }> {
    try {
      const refreshedUser = await this.usersService.findOneByEmailJoinResetPasswordRequest(resetPasswordRequest.email);
      if (!refreshedUser) {
        throw new ForbiddenException('No user is registered with this email address.');
      }

      if (refreshedUser.resetPasswordRequest) {
        await this.removePasswordReset(refreshedUser.resetPasswordRequest);
      }
      await this.usersService.requestResetPassword(
        refreshedUser,
        await this.generatePasswordResetRequest(refreshedUser),
      );

      return {
        message: 'Password reset request has been created. Please check your mailbox for further details.',
        errors: [],
      };
    } catch (e) {
      this.logger.error(`Error happened during creating reset user password request: ${String(e.message)}`);
      throw e;
    }
  }

  public async resetUserPassword(resetPassword: AuthResetPasswordDto): Promise<User> {
    try {
      const user = await this.usersService.findOneByPasswordResetToken(resetPassword.token);
      if (!user) {
        throw new ForbiddenException('Failed to reset your password: a valid reset password token should be provided!');
      }
      const isValidToken = await this.isValidToken(resetPassword.token);
      if (!isValidToken) {
        throw new ForbiddenException('Access token is invalid or expired');
      }

      this.validateNewPassword(user, resetPassword.password);

      const updatedUser = await this.resetPassword(user, resetPassword);
      return updatedUser;
    } catch (e) {
      this.logger.error(`Error happened during resetting user password: ${String(e.message)}`);
      throw e;
    }
  }

  public async changePassword(loggedUser: User, authUpdatePasswordDto: AuthUpdatePasswordDto): Promise<User> {
    try {
      const isPasswordValid: boolean = await bcrypt.compare(loggedUser.password, authUpdatePasswordDto.currentPassword,);

      if (!isPasswordValid) {
        throw new InvalidPasswordException('Current password is invalid');
      }

      this.validateNewPassword(loggedUser, authUpdatePasswordDto.password);

      const hashedPassword = await bcrypt.hash(authUpdatePasswordDto.password, 12);
      const updatedUser = await this.usersService.update(loggedUser.id, { password: hashedPassword });
      return updatedUser;
    } catch (e) {
      this.logger.error(`Error happens while changing user: ${loggedUser.id} password: ${String(e.message)}`);
      throw e;
    }
  }

  public async createTokensPair(jwtPayload: IJwtPayload): Promise<AuthTokenDto> {
    const accessToken = await this.jwtService.signAsync(jwtPayload);
    return {
      accessToken,
      refreshToken: await uuidv4(256),
    };
  }

  public createAuthToken(accessToken: string, refreshToken: string): AuthToken {
    return this.authTokenRepository.create({
      accessToken,
      refreshToken,
    });
  }

  public async removePasswordReset(resetPasswordRequest: ResetPasswordRequest): Promise<ResetPasswordRequest> {
    return this.passwordResetRepository.remove(resetPasswordRequest);
  }

  public async validateUser(payload: IJwtPayload): Promise<User> {
    return await this.usersService.findOneByEmail(payload.email);
  }

  public async logout(email: string): Promise<DeleteResult> {
    const tokenId = await this.usersService.nullifyToken(email);
    return this.authTokenRepository.delete(tokenId);
  }

  public async updateToken(id: string, updateDto: AuthTokenUpdateDto): Promise<UpdateResult> {
    return this.authTokenRepository.update(id, updateDto);
  }

  public async validateAndDecodeToken(token: string): Promise<IJwtPayload> {
    return await this.jwtService.verifyAsync<IJwtPayload>(token);
  }

  public async isValidToken(token: string): Promise<boolean> {
    try {
      const decoded: IJwtPayload = await this.validateAndDecodeToken(token);
      if (decoded && decoded.email) {
        const user = await this.usersService.findOneByEmail(decoded.email);
        if (user) {
          this.logger.debug(`User ${user.id} is authenticated successfully`);
          return true;
        }
        this.logger.warn(`There is no user with id ${decoded.email} in the database`);
      }
      return false;
    } catch (error) {
      this.logger.error(`Error happened during checking reset password token, ${String(error.message)}`);
      return false;
    }
  }

  private async resetPassword(user: User, resetPasswordDto: AuthResetPasswordDto): Promise<User> {
    let resetPasswordRequest = user.resetPasswordRequest;
    if (user.resetPasswordRequest) {
      await this.removePasswordReset(user.resetPasswordRequest);
      resetPasswordRequest = null;
    }

    await this.usersService.update(user.id, {
      password: resetPasswordDto.password,
      resetPasswordRequest,
    });
    return await this.createOrUpdateToken(user);
  }

  private validateNewPassword(user: User, password: string): void {
    if (!password.match(passwordPattern)) {
      throw new BadRequestException(
        'Min. 8 characters, both upper and lower case letters, at least one number and special character',
      );
    }

    const result = zxcvbn(password, [user.firstName, user.lastName, user.email]);
    if (result.score < 3) {
      throw new BadRequestException(this.prettyPrintZxcvbnFeedback(result));
    }
  }

  private async createOrUpdateToken(user: User): Promise<User> {
    if (user.token && user.token.id) {
      await this.logout(user.email);
      user = await this.usersService.findOneById(user.id);
    }

    const authToken = await this.createTokensPair({
      email: user.email,
    });
    const { accessToken, refreshToken } = authToken;
    return await this.usersService.update(user.id, {
      token: this.createAuthToken(accessToken, refreshToken),
    });
  }

  private prettyPrintZxcvbnFeedback(result: any): string {
    if (!result.feedback) {
      this.logger.warn(`No feedback provided: ${inspect(result)}`);
      return 'Please provide a more complex password.';
    }
    let feedback = '';
    if (result.feedback.warning) {
      feedback += `${String(result.feedback.warning)}. `;
    }
    if (result.feedback.suggestions) {
      const suggestions = result.feedback.suggestions as string[];
      for (let i = 0; i < suggestions.length; i++) {
        const suggestion: string = suggestions[i];
        feedback += suggestion;
        if (i !== suggestions.length - 1) {
          feedback += ', ';
        }
      }
    }
    if (!feedback) {
      this.logger.warn(`No feedback provided: ${inspect(result)}`);
      return 'Please provide a more complex password.';
    }
    return feedback;
  }

  private async generatePasswordResetRequest(user: User): Promise<ResetPasswordRequest> {
    return this.passwordResetRepository.save(
      this.passwordResetRepository.create({
        token: await this.jwtService.signAsync(
          { id: user.id },
          { expiresIn: this.configService.get('RESET_PASSWORD_TOKEN_EXPIRES_IN') },
        ),
      }),
    );
  }
}
