import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { SeederService } from './seeder.service';

@Module({
  imports: [UsersModule],
  providers: [SeederService]
})
export class SeederModule {}
