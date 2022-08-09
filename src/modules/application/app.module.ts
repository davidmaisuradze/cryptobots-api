import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MarketModule } from '../market/market.module';
import { UsersModule } from '../users/users.module';
import { SeederModule } from '../seeder/seeder.module';
import { AuthModule } from '../auth/auth.module';
import { typeOrmAsyncConfig } from '../../config/database';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UsersModule,
    MarketModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
