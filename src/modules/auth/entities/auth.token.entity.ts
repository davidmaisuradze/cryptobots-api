import { Column, CreateDateColumn, Entity } from 'typeorm';
import { Type } from 'class-transformer';
import { CoreEntity } from '../../../modules/application/entities/core.entity';

@Entity('tokens')
export class AuthToken extends CoreEntity {
  @Column({
    type: 'varchar',
    nullable: true,
  })
    accessToken: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
    refreshToken: string;

  @Type(() => Date)
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'lastActivity' })
    lastActivity: Date;
}
