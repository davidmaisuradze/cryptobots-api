
import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IsPasswordConfirmedBy } from '../../../validators';
import { AuthPasswordDto } from './auth.password.dto';

export class AuthRegisterDto extends AuthPasswordDto {
  @ApiProperty({
    description: 'First Name',
    required: true,
  })
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty({
    description: 'Last Name',
    required: true,
  })
  @IsNotEmpty()
  public lastName: string;
  
  @ApiProperty({
    description: 'User email',
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsPasswordConfirmedBy('password')
  @ApiProperty({
    description: 'Confirmed Password',
    required: true,
  })
  @IsNotEmpty()
  @IsPasswordConfirmedBy('password')
  public confirmedPassword: string;
}
