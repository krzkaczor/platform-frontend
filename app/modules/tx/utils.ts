import BigNumber from "bignumber.js";
import { addHexPrefix } from "ethereumjs-util";
import { TxData } from "web3";

export const GAS_PRICE_MULTIPLIER = 1 + parseFloat(process.env.NF_GAS_PRICE_OVERHEAD || "0");

export const GAS_LIMIT_MULTIPLIER = 1 + parseFloat(process.env.NF_GAS_LIMIT_OVERHEAD || "0");

export const EMPTY_DATA = "0x00";

export const calculateGasPriceWithOverhead = (gasPrice: BigNumber): BigNumber =>
  gasPrice.mul(GAS_PRICE_MULTIPLIER);

export const calculateGasLimitWithOverhead = (gasLimit: BigNumber): BigNumber =>
  gasLimit.mul(GAS_LIMIT_MULTIPLIER);

export const encodeTransaction = (txData: Partial<TxData>) => {
  return {
    from: addHexPrefix(txData.from!),
    to: addHexPrefix(txData.to!),
    gas: addHexPrefix(new BigNumber(txData.gas || 0).toString(16)),
    gasPrice: addHexPrefix(new BigNumber(txData.gasPrice || 0).toString(16)),
    value: addHexPrefix(new BigNumber(txData.value! || 0).toString(16)),
    data: addHexPrefix(txData.data || EMPTY_DATA),
  };
};
