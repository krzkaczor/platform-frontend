import { IStateTxData} from "../../web3/interfaces";
import {ETxSenderType} from "../interfaces";

export enum ETransactionErrorType {
  NOT_ENOUGH_ETHER_FOR_GAS = "not_enough_ether_for_gas",
  FAILED_TO_GENERATE_TX = "failed_to_generate_tx",
  GAS_TOO_LOW = "gas_too_low",
  TOO_MANY_TX_IN_QUEUE = "too_many_tx_in_queue",
  INVALID_RLP_TX = "invalid_rlp_tx",
  INVALID_CHAIN_ID = "invalid_chain_id",
  TX_WAS_REJECTED = "tx_was_rejected",
  NOT_ENOUGH_FUNDS = "not_enough_funds",
  ERROR_WHILE_WATCHING_TX = "error_while_watching_tx",
  OUT_OF_GAS = "out_of_gas",
  REVERTED_TX = "reverted_tx",
  NONCE_TOO_LOW = "nonce_too_low",
  LEDGER_CONTRACTS_DISABLED = "ledger_contracts_disabled",
  UNKNOWN_ERROR = "unknown_error",
}

export enum EValidationState {
  NOT_ENOUGH_ETHER_FOR_GAS = "not_enough_ether_for_gas",
  VALIDATION_OK = "validation_ok",
}

export enum ETxSenderState {
  UNINITIALIZED = "UNINITIALIZED",
  WATCHING_PENDING_TXS = "WATCHING_PENDING_TXS",
  INIT = "INIT",
  SUMMARY = "SUMMARY",
  ACCESSING_WALLET = "ACCESSING_WALLET",
  SIGNING = "SIGNING",
  MINING = "MINING",
  DONE = "DONE",
  ERROR_SIGN = "ERROR_SIGN",
}

export type TSummaryData = { txData: Partial<IStateTxData>; additionalData?: any };

export interface IStateTxSender {
  state: ETxSenderState;
  type?: ETxSenderType;
  txDetails?: IStateTxData;
  summaryData?: TSummaryData;
  blockId?: number;
  txHash?: string;
  error?: ETransactionErrorType;
  validationState?: EValidationState;
}
