import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
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
  public password: string;
}
