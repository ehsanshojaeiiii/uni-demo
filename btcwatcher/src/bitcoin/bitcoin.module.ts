import { Module, Scope } from "@nestjs/common";
import { BitcoinService } from "./bitcoin.service";
import { HttpModule } from "@nestjs/axios";
import { RedisConnection } from "../redis-connection/redis-connection";

@Module({
  imports: [HttpModule],

  providers: [BitcoinService, {
    provide: "REDIS_CONNECTION",
    scope: Scope.DEFAULT,
    useFactory: () => new RedisConnection().getInstance({
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT,
      REDIS_DB: parseInt(process.env.REDIS_DB_NUMBER_BTC)
    })
  }],
  controllers: []
})
export class BitcoinModule {
}
