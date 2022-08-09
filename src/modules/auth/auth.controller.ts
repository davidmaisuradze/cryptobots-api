import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':address')
  getNonce(@Param('address') address: string) {
    return this.authService.getNonce(address);
  }

  @Post(':address')
  verifySignedLoginTransaction(@Param('address') address: string, @Body() body: { signedMessage: any }) {
    return this.authService.verifySignedLoginTransaction(address, body.signedMessage);
  }
}
