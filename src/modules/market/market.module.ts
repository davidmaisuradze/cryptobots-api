import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketService } from './market.service';
import { MarketController } from './market.controller';
import { Market } from './entities/market.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Market])],
  controllers: [MarketController],
  providers: [MarketService]
})
export class MarketModule {}
