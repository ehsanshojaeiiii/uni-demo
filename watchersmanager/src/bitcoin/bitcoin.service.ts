import {Inject, Injectable, OnModuleInit} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {RedisClient} from "redis";
import {promisify} from "util";
import {RPCClient} from "@phungdaihiep/rpc-bitcoin";
import {WatcherStatusDto} from "../domain/dto/WatcherStatus.dto";
import {SuccessResponse} from "../domain/responses/success.response";
import {CreatedResponse} from "../domain/responses/created.response";
import {AddressDto} from "../domain/dto/address.dto";
import {ErrorResponse} from "../domain/responses/error.response";
import {StatusCode} from "../domain/enums/status.code.enum";
import {DeletedResponse} from "../domain/responses/deleted.response";
import {BtcBlockEntity} from "../domain/entity/btcblock.entity";
import validate from "bitcoin-address-validation";


@Injectable()
export class BitcoinService implements OnModuleInit {

    constructor(
        private http: HttpService,
        @Inject("REDIS_CONNECTION_BTC") private redis: RedisClient
    ) {

    }


    rpcClient = new RPCClient({
        url: "",
        port: 8332,
        timeout: 600000,
        user: "",
        pass: ""
    });


    redisFunc = {
        set: async (key, value) => {
            const set = promisify(this.redis.set).bind(this.redis);
            return await set(key, value);
        },
        exists: async (address) => {
            const func = promisify(this.redis.exists).bind(this.redis);
            return await func(address);
        },
        keys: async () => {
            const keys = promisify(this.redis.keys).bind(this.redis);
            return await keys("*");
        },
        del: async (address) => {
            const del = promisify(this.redis.del).bind(this.redis);
            return await del(address);
        }

    };

    async getWatcherStatus() {

        const allKeys = await this.redisFunc.keys();
        const blockNumber = await BtcBlockEntity.find();
        if (blockNumber.length == 0) {
            return new ErrorResponse(StatusCode.BAD_REQUEST, "watcher db is empty(btcwatcher not started)")
        }
        const watcherStatusDto: WatcherStatusDto = {
            lastBlockWatched: blockNumber[0].lastBlockNumber,
            addressCount: allKeys.length
        };

        return new SuccessResponse("success", watcherStatusDto);

    }

    async addAddress(addressDto: AddressDto) {
        const {address, userId} = addressDto;
        if (!validate(address)) return new ErrorResponse(StatusCode.BAD_REQUEST, "address is invalid");

        const existAddress = await this.redisFunc.exists(address);

        if (existAddress) return new ErrorResponse(StatusCode.BAD_REQUEST, "already exist");

        await this.redisFunc.set(address, userId);

        return new CreatedResponse("created");

    }

    async deleteAddress(addressDto: AddressDto) {
        const {address} = addressDto;

        if (!validate(address)) return new ErrorResponse(StatusCode.BAD_REQUEST, "address is invalid");

        const existAddress = await this.redisFunc.exists(address);

        if (!existAddress) return new ErrorResponse(StatusCode.BAD_REQUEST, "not exist");

        await this.redisFunc.del(address);

        return new DeletedResponse("deleted");

    }


    async onModuleInit() {
        const allKeys = await this.redisFunc.keys();
        console.log(` number of addresses in btc redis_db:${allKeys.length}`);

    }

}
