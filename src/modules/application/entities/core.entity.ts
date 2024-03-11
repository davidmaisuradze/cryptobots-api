import { Expose } from 'class-transformer';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, BaseEntity } from 'typeorm';

export abstract class CoreEntity extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Expose()
  @CreateDateColumn({ type: 'timestamp with time zone' })
    createdAt: Date;

  @Expose()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
    updatedAt: Date;

  constructor(partial: Partial<CoreEntity>) {
    super();
    Object.assign(this, partial);
  }
}
