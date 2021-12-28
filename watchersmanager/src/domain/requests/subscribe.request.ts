import {Currency} from "../enums/currency.enum";

export class SubscribeRequest {
    address: string;

    coin: Currency;

    walletId?: number;
    confirmation?: number;
}
