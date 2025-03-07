import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class AuthRefreshTokenDto {
  @ApiProperty({
    description: 'Refresh Token',
    required: true,
  })
  @Allow()
    refreshToken: string;
}
