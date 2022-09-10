import { IsNotEmpty, MinLength, Matches, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IsPasswordConfirmedBy } from '../../../validators';

export class RegisterDto {
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

  @ApiProperty({
    description: 'Password',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9\W_]).*$/, {
    message: 'Must contain at least one number or special character, both upper and lower case letters',
  })
  public password: string;

  @IsPasswordConfirmedBy('password')
  @ApiProperty({
    description: 'Confirmed Password',
    required: true,
  })
  @IsNotEmpty()
  @IsPasswordConfirmedBy('password')
  public confirmedPassword: string;
}
