import {Module, Scope} from '@nestjs/common';
import {BitcoinModule} from './bitcoin/bitcoin.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule} from "@nestjs/config";
import {ScheduleModule} from "@nestjs/schedule";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            envFilePath: `env/${process.env.NODE_ENV || 'dragons'}.env`,
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: parseInt(process.env.POSTGRES_PORT),
                username: process.env.POSTGRES_USER,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DB,
                entities: [__dirname + '/domain/**/*.entity{.ts,.js}'],
                synchronize: true,
                logging: ['error'],
            }),
        }),
        BitcoinModule,

    ],
    controllers: [],
    providers: [],
    exports: []
})
export class AppModule {
}
