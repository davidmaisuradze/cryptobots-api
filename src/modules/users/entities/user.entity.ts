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
  public firstName: string;

  @ApiProperty({ readOnly: true })
  @Expose()
  @Allow()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  public lastName: string;

  @ApiProperty({ readOnly: true, type: 'string', format: 'email' })
  @Allow()
  @Expose()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  public email: string;

  @ApiProperty({ readOnly: true })
  @Allow()
  @Column({
    type: 'varchar',
    nullable: true,
  })
  public password: string;

  @ApiProperty({ readOnly: true })
  @OneToOne(() => AuthToken, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  @Expose({ groups: ['showTokens'] })
  public token: AuthToken;

  @Column({
    type: 'boolean',
    default: false,
  })
  @Allow()
  @Expose()
  public isActive = false;
}
