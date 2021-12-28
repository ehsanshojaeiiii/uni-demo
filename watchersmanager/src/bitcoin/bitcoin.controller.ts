import { Body, Controller, Delete, Get, Post } from "@nestjs/common";
import { BitcoinService } from "./bitcoin.service";
import { AddressDto } from "../domain/dto/address.dto";


@Controller("btcwatcher")
export class BtcTransferController {
  constructor(
    private bitcoinService: BitcoinService
  ) {
  }


  @Get("status")
  async getWatcherStatus() {
    return await this.bitcoinService.getWatcherStatus();
  }

  @Post("address")
  async addAddress(
    @Body() addressDto: AddressDto
  ) {
    return await this.bitcoinService.addAddress(addressDto);
  }

  @Delete("address")
  async deleteAddress(
    @Body() addressDto: AddressDto
  ) {
    return await this.bitcoinService.deleteAddress(addressDto);
  }


}
