import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthPasswordDto } from './auth.password.dto';
import { IsPasswordConfirmedBy, IsPasswordNotEqual } from '../../../validators';

export class AuthUpdatePasswordDto extends AuthPasswordDto {
  @IsPasswordConfirmedBy('password')
  @ApiProperty({
    description: 'A password confirmation',
    required: true,
  })
  @IsNotEmpty()
  public confirmedPassword: string;

  @IsPasswordNotEqual('password')
  @ApiProperty({
    description: 'Current password',
    required: true,
  })
  @IsNotEmpty()
  public readonly currentPassword: string;
}
