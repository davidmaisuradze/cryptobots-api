import { IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUserAlreadyExists } from '../../../validators';
import { AuthToken } from '../../auth/entities/auth.token.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'First name',
    required: true,
  })
  @IsOptional()
    firstName?: string;

  @ApiProperty({
    description: 'Last name',
    required: true,
  })
  @IsOptional()
    lastName?: string;

  @ApiProperty({
    description: 'Email',
    required: true,
  })
  @IsOptional()
  @IsEmail()
  @IsUserAlreadyExists()
    email?: string;

  @ApiProperty({
    description: 'Address',
    required: true,
  })
  @IsOptional()
    address: string;

  @ApiProperty({
    description: 'Nonce to sign auth',
    required: true,
  })
  @IsOptional()
    signNonce?: number;

  @ApiProperty({
    description: 'Nonce to sign auth',
    required: true,
  })
  @IsOptional()
    token?: AuthToken;
}
