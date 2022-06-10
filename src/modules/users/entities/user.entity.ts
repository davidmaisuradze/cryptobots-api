import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Allow } from 'class-validator';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

@Exclude()
@Entity('users')
export class User {
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
    nullable: true,
  })
  password: string;

  @ApiProperty({ readOnly: true, type: 'string', format: 'email' })
  @Allow()
  @Expose()
  @Column({
    type: 'varchar',
    unique: true,
  })
  email: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  @Allow()
  @Expose()
  isActive = false;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  salt: string;
}
