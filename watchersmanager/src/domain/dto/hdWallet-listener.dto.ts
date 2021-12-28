import {Currency} from "../enums/currency.enum";
import { NetworkTypeEnum } from "../enums/network-type.enum";
import { TransactionType } from "../enums/transaction-type.enum";
import { EventStatus } from "../enums/event-status.enum";

export class HdWalletListenerDto  {
    amount: number;
    confirms: number;
    status: EventStatus;
    fromAddress: any; // string || string []
    toAddress: any; // string || string []
    coin: Currency;
    type: TransactionType;
    default: boolean;
    hash: string;
    network: NetworkTypeEnum;
}
