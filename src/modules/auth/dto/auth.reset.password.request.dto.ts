import { IsEmail, IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthResetPasswordRequestDto {
  @ApiProperty({
    description: 'User email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
    email: string;

  @ApiProperty({
    description: 'Frontend URL',
    required: true,
  })
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
    url: string;
}
