import BigNumber from "bignumber.js";
import {TWalletMetadata} from "../../lib/persistence/WalletMetadataObjectStorage";
import {NumericString} from "../../types";
import {bigNumberToNumericString, numericStringToBigNumber} from "../../utils/numericStringUtils";

export interface IDisconnectedWeb3State {
  connected: false;
  previousConnectedWallet?: TWalletMetadata;
}

export interface IWalletPrivateData {
  seed: string[];
  privateKey: string;
}
export interface IConnectedWeb3State {
  connected: true;
  wallet: TWalletMetadata;
  isUnlocked: boolean; // this is important only for light wallet
  walletPrivateData?: {
    seed: string;
    privateKey: string;
  };
}

export type IWeb3State = IDisconnectedWeb3State | IConnectedWeb3State;

// normalized information about all possible types of personal wallets
export enum EWalletType {
  LEDGER = "LEDGER",
  BROWSER = "BROWSER",
  LIGHT = "LIGHT",
  UNKNOWN = "UNKNOWN",
}
export enum EWalletSubType {
  METAMASK = "METAMASK",
  PARITY = "PARITY",
  UNKNOWN = "UNKNOWN",
}

export interface IBlTxData {
  to: string;
  value: BigNumber;
  data?: string;
  from: string;
  input?: string;
  gas: BigNumber;
  gasPrice: BigNumber;
}

export interface IStateTxData {
  to: string;
  value: NumericString;
  data?: string;
  from: string;
  input?: string;
  gas: NumericString;
  gasPrice: NumericString;
}

export interface IApiTxData {
  to: string;
  value: string;
  data?: string;
  from: string;
  input?: string;
  gas: string;
  gasPrice: string;
}

export const stateToBlConversionSpec = {
  value: numericStringToBigNumber(),
  gas: numericStringToBigNumber(),
  gasPrice: numericStringToBigNumber()
};

export const blToStateConversionSpec = {
  value: bigNumberToNumericString(),
  gas: bigNumberToNumericString(),
  gasPrice: bigNumberToNumericString()
};

export interface IRawTxData extends IApiTxData {
  nonce: string;
}

export interface IEthereumNetworkConfig {
  rpcUrl: string;
}
