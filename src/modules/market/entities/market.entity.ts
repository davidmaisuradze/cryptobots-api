import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Allow } from 'class-validator';
import { CoreEntity } from '../../application/entities/core.entity';
import { Column, Entity } from 'typeorm';

@Exclude()
@Entity('market')
export class Market extends CoreEntity {
  @ApiProperty({ readOnly: true })
  @Expose()
  @Allow()
  @Column({
    type: 'float',
    nullable: true,
  })
    price: number;

  @ApiProperty({ readOnly: true })
  @Expose()
  @Allow()
  @Column({
    type: 'varchar',
    nullable: true,
  })
    currency: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
    name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
    description: number;

  @ApiProperty({ readOnly: true })
  @Allow()
  @Expose()
  @Column({
    type: 'float',
    nullable: true,
  })
    receivedOffer: number;

  @ApiProperty({ readOnly: true })
  @Allow()
  @Expose()
  @Column({
    type: 'varchar',
    nullable: true,
  })
    blockchainStatus: string;
}
