import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Allow } from 'class-validator';
import { CoreEntity } from '../../application/entities/core.entity';
import { AuthToken } from '../../auth/entities/auth.token.entity';

@Exclude()
@Entity('users')
export class User extends CoreEntity {
  @ApiProperty({ readOnly: true })
  @Expose()
  @Allow()
  @Column({
    type: 'varchar',
    nullable: true,
  })
    firstName: string;

  @ApiProperty({ readOnly: true })
  @Expose()
  @Allow()
  @Column({
    type: 'varchar',
    nullable: true,
  })
    lastName: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
    address: string;

  @Column({
    type: 'bigint',
    nullable: true,
  })
    signNonce: number;

  @ApiProperty({ readOnly: true })
  @OneToOne(() => AuthToken, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  @Expose({ groups: ['showTokens'] })
    token: AuthToken;

  @ApiProperty({ readOnly: true, type: 'string', format: 'email' })
  @Allow()
  @Expose()
  @Column({
    type: 'varchar',
    nullable: true,
  })
    email: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  @Allow()
  @Expose()
    isActive = false;
}
