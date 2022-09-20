import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { BaseResponse } from '../../common/dto/response/base.response.dto';

export class UserResponse extends BaseResponse {
  @ApiPropertyOptional({
    description: 'First name',
    type: 'string',
    example: 'John',
  })
  @Expose()
  public firstName: string;

  @ApiPropertyOptional({
    description: 'Last name',
    type: 'string',
    example: 'Doe',
  })
  @Expose()
  public lastName: string;

  @ApiProperty({
    description: 'Email',
    type: 'string',
    format: 'email',
    example: 'john.doe@corp.umbrella.com',
  })
  @Expose()
  public email: string;

  @ApiProperty({
    description: 'Indicates is user active or not',
    type: 'boolean',
  })
  @Expose()
  public isActive: boolean;

  @ApiProperty()
  @Expose()
  public isRoleUpdating: boolean;

  @ApiProperty({
    description: 'Created at date',
    type: 'string',
    format: 'date',
    example: '2019-02-11T10:59:12.068Z',
  })
  @Expose()
  public removedAt: Date | null;
}
