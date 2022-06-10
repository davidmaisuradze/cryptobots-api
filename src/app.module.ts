import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { databaseConfiguration } from "./config";
import { MarketModule } from "./modules/market/market.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    UsersModule,
    MarketModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: () => databaseConfiguration(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
