import { Body, Controller, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators';
import { 
  AuthLoginDto,
  AuthRefreshTokenDto,
  AuthRegisterDto,
  AuthResetPasswordDto,
  AuthResetPasswordRequestDto,
  AuthUpdatePasswordDto, 
} from './dto';
import { JwtAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {
  }

  @Post('register')
  async register(@Body() userDto: AuthRegisterDto) {
    return await this.authService.register(userDto);
  }

  @Post('login')
  async login(@Body() loginDto: AuthLoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() currentUser: User) {
    return await this.authService.logout(currentUser.email);
  }

  @Post('refresh-token')
  public async refreshToken(
    @Body() refreshTokenDto: AuthRefreshTokenDto,
  ): Promise<boolean> {
    await this.authService.refreshUserToken(refreshTokenDto);
    return true;
  }

  @Put('reset-password-request')
  public async resetPasswordRequest(@Body() resetPasswordRequest: AuthResetPasswordRequestDto): Promise<{
    message: string;
    errors: any[];
  }> {
    return await this.authService.resetPasswordRequest(resetPasswordRequest);
  }

  @Patch('reset-password')
  public async resetPassword(@Body() resetPassword: AuthResetPasswordDto): Promise<boolean> {
    await this.authService.resetUserPassword(resetPassword);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/change-password')
  public async changePassword(
    @CurrentUser() loggedUser: User,
    @Body() authUpdateAuthPasswordDto: AuthUpdatePasswordDto,
  ): Promise<boolean> {
    const { id } = await this.authService.changePassword(loggedUser, authUpdateAuthPasswordDto);
    await this.userService.findOneById(id);
    return true;
  }
}
