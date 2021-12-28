import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { RedisClient } from "redis";
import { promisify } from "util";
import { BtcBlockEntity } from "../domain/entity/btcblock.entity";
import { RPCClient } from "@phungdaihiep/rpc-bitcoin";
import { WebhookDto } from "../domain/dto/webhook.dto";

const axios = require("axios").default;


@Injectable()
export class BitcoinService implements  OnModuleInit{

  constructor(
    private http: HttpService,
    @Inject("REDIS_CONNECTION") private redis: RedisClient
  ) {

  }


  initNode = {
    url: process.env.NODE_URL,
    port: parseInt(process.env.NODE_PORT),
    timeout: 600000,
    user: process.env.NODE_USER,
    pass: process.env.NODE_PASS
  };

  rpcClient = new RPCClient(this.initNode);


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


  async main() {
    while (true) {
      try {
        console.log(`===========================================================`);
        const blockCheck = await BtcBlockEntity.find();

        let blockHash;
        const blockNumber = await this.rpcClient.getblockcount();
        console.log(`currentBlock:  ${blockNumber}`);
        console.log(`blockNumber In Db:  ${blockCheck[0]?.lastBlockNumber}`);
        if (blockCheck.length == 0) {
          // console.log(`check this block: ${blockNumber - 6}`);
          blockHash = await this.rpcClient.getblockhash({ height: blockNumber - 6 });
        } else {
          if (blockNumber - blockCheck[0].lastBlockNumber <= 6) {
            console.log("waiting ---");
            await new Promise(r => setTimeout(r, 60 * 60 * 100));

            continue;
          } else {
            blockHash = await this.rpcClient.getblockhash({ height: blockCheck[0].lastBlockNumber + 1 });
            // console.log(`checking this block:  ${blockCheck[0].lastBlockNumber + 1}`);
          }
        }


        const data = {
          "method": "getblock",
          "params": {
            "blockhash": `${blockHash}`,
            "verbosity": 2
          },
          "jsonrpc": 2,
          "id": "rpc-bitcoin"
        };
        const config = {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": process.env.NODE_AUTH,
            "Connection": "keep-alive"
          }
        };

        const res = await axios.post("http://162.55.100.75:8332/", data, config);

        const blockObject = res.data.result;

        console.log(`checking this block: ${blockObject.height} checking start`);


        if (!blockObject?.height) continue;


        for (let i = 0; i < blockObject.nTx; i++) {
          for (let j = 0; j < blockObject.tx[i].vout.length; j++) {
            const address = blockObject.tx[i].vout[j].scriptPubKey.address;
            if (!address) break;

            const addressExists = await this.redisFunc.exists(address);
            if (addressExists == 1) {
              console.log(`+ Found Address => ${address} TX: ${blockObject.tx[i].txid} AMOUNT: ${blockObject.tx[i].vout[j].value}`);
              const data: WebhookDto = {
                amount: blockObject.tx[i].vout[j].value,
                address,
                txId: blockObject.tx[i].txid
              };
              this.webHook(data).then();
            }

          }
        }


        if (blockCheck.length == 0) {
          const blockEntity = new BtcBlockEntity();

          blockEntity.lastBlockNumber = blockObject.height;
          await blockEntity.save();
        } else {
          blockCheck[0].lastBlockNumber = blockObject.height;
          await blockCheck[0].save();
        }

      } catch (e) {
        console.log(JSON.stringify(e));

      }
    }
  }

  async webHook(data) {
    this.http.post(process.env.WEBHOOK_URL, data);
  }


  async onModuleInit() {
    const allKeys = await this.redisFunc.keys();
    console.log(` number of addresses ${allKeys.length}`);
    await this.main();

  }

}
