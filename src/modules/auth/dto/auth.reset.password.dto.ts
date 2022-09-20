import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthPasswordDto } from './auth.password.dto';
import { IsPasswordConfirmedBy } from '../../../validators';

export class AuthResetPasswordDto extends AuthPasswordDto {
  @ApiProperty({
    description: 'Password reset request token',
    required: true,
  })
  @IsNotEmpty()
  public token: string;

  @IsPasswordConfirmedBy('password')
  @ApiProperty({
    description: 'A password confirmation',
    required: true,
  })
  @IsNotEmpty()
  public confirmedPassword: string;
}
