import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Expose, Type } from 'class-transformer';
import { Allow } from 'class-validator';

export abstract class CoreEntity {
  @Expose()
  @Allow()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Expose()
  @Allow()
  @Type(() => Date)
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  public createdAt: Date;

  @Expose()
  @Allow()
  @Type(() => Date)
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  public updatedAt: Date;

  constructor(partial: Partial<CoreEntity>) {
    Object.assign(this, partial);
  }
}
