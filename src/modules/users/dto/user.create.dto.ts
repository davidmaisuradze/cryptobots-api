import { IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUserAlreadyExists } from '../../../validators';
import { AuthToken } from '../../auth/entities/auth.token.entity';

export class UserCreateDto {
  @ApiProperty({
    description: 'First name',
    required: true,
  })
  public firstName: string;

  @ApiProperty({
    description: 'Last name',
    required: true,
  })
  public lastName: string;

  @ApiProperty({
    description: 'Email',
    required: true,
  })
  @IsEmail()
  @IsUserAlreadyExists()
  public email: string;  

  @ApiProperty({
    description: 'Password',
    required: true,
  })
  public password: string;  

  @ApiProperty({
    description: 'Auth token',
    required: true,
  })
  @IsOptional()
  public token?: AuthToken;
}
