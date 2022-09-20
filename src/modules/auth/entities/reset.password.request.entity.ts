import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

import { CoreEntity } from '../../common/entities/core.entity';

@Entity('reset_password_requests')
@Exclude()
export class ResetPasswordRequest extends CoreEntity {
  @Column({
    type: 'varchar',
  })
  public token: string;
}
