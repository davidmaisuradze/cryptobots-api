import { IsNotEmpty, MinLength, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthPasswordDto {
  @ApiProperty({
    description: 'A password',
    required: true,
  })
  @IsOptional()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9\W_]).*$/, {
    message: 'Must contain at least one number or special character, both upper and lower case letters',
  })
    password: string;
}
