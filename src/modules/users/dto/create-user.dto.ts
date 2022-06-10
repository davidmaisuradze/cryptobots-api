import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPasswordConfirmedBy, IsUserAlreadyExists } from '../../../validators';

export class CreateUserDto {
  @ApiProperty({
    description: 'First name',
    required: true,
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name',
    required: true,
  })
  lastName: string;

  @ApiProperty({
    description: 'Email',
    required: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @IsUserAlreadyExists()
  email: string;

  @ApiProperty({
    description: 'Password',
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsPasswordConfirmedBy('password')
  @ApiProperty({
    description: 'A password confirmation',
    required: true,
  })
  @IsNotEmpty()
  passwordConfirmation: string;
}
