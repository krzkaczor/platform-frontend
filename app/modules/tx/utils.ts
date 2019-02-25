import BigNumber from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";

import { TBigNumberVariant } from "../../lib/web3/types";
import { multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { Transaction } from 'web3-core/types';

export const GAS_PRICE_MULTIPLIER = 1 + parseFloat(process.env.NF_GAS_PRICE_OVERHEAD || "0");

export const GAS_LIMIT_MULTIPLIER = 1 + parseFloat(process.env.NF_GAS_LIMIT_OVERHEAD || "0");

export const EMPTY_DATA = "0x00";

export const calculateGasPriceWithOverhead = (gasPrice: TBigNumberVariant) =>
  new BigNumber(multiplyBigNumbers([gasPrice, GAS_PRICE_MULTIPLIER])).ceil().toString();

export const calculateGasLimitWithOverhead = (gasLimit: TBigNumberVariant) =>
  new BigNumber(multiplyBigNumbers([gasLimit, GAS_LIMIT_MULTIPLIER])).ceil().toString();

export const encodeTransaction = (txData: Partial<Transaction>) => {
  return {
    from: addHexPrefix(txData.from as string),
    to: addHexPrefix(txData.to!),
    gas: addHexPrefix(new BigNumber(txData.gas || 0).toString(16)),
    gasPrice: addHexPrefix(new BigNumber(txData.gasPrice || 0).toString(16)),
    value: addHexPrefix(new BigNumber(txData.value! || 0).toString(16)),
    data: addHexPrefix(txData.data || EMPTY_DATA),
  };
};
