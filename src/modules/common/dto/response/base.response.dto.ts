import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export abstract class BaseResponse {
  @ApiProperty({
    description: 'Id',
    type: 'string',
    format: 'uuid',
    example: 'da6a6f55-c269-4d88-81e7-45fce37e09a5',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'Created at date',
    type: 'string',
    format: 'date',
    example: '2019-02-11T10:59:12.068Z',
  })
  @Expose()
  public createdAt: Date;

  @ApiProperty({
    description: 'Updated at date',
    type: 'string',
    format: 'date',
    example: '2019-02-11T10:59:12.068Z',
  })
  @Expose()
  public updatedAt: Date;
}
