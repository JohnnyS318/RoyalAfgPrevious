import * as mongoose from 'mongoose';
import { UserSchemaName } from '../../user/models/user-schema';
import Decimal from 'decimal.js';
import { Logger } from '@nestjs/common';

export const WalletSchemaName = "Wallet";

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserSchemaName,
    required: true,
    unique: true
  },
  balanceNumber: {
    type: Number,
    default: 0,
  },
});

WalletSchema.virtual("balance").get(
  function(){
    if(!this.balanceNumber){
      return new Decimal(0);
    }
    return new Decimal(this.balanceNumber);
  }).set(
    function(val: Decimal) {
      Logger.verbose(`Setting new balance ${val}`);
      this.balanceNumber =  val.ceil().toNumber();
  });

export { WalletSchema }