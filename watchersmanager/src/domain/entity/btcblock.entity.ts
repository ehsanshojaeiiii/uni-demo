import {Column, Entity} from "typeorm";
import {BaseEntity} from "./base.entity";

@Entity('btc')
export class BtcBlockEntity extends BaseEntity {
    @Column()
    lastBlockNumber: number;
}
