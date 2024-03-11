import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { UserResponse } from './user.response';
import { AuthTokenDto } from '../../auth/dto';

export class UserResponseWithToken extends UserResponse {
  @ApiProperty({
    description: 'User auth token',
    type: AuthTokenDto,
  })
  @Type(() => AuthTokenDto)
  public token: AuthTokenDto;
}
