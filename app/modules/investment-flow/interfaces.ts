import BigNumber from "bignumber.js";

import { NumericString } from "../../types";

export enum EInvestmentType {
  InvestmentWallet = "INVESTMENT_WALLET",
  ICBMEth = "ICBM_ETH",
  ICBMnEuro = "ICBM_NEURO",
  BankTransfer = "BANK_TRANSFER",
}

export enum EInvestmentCurrency {
  Ether = "ETH",
  Euro = "EUR",
}

export enum EInvestmentErrorState {
  AboveMaximumTicketSize = "above_maximum_ticket_size",
  BelowMinimumTicketSize = "below_minimum_ticket_size",
  ExceedsTokenAmount = "exceeds_token_amount",
  ExceedsWalletBalance = "exceeds_wallet_balance",
}

export enum EBankTransferFlowState {
  Details = "details",
  Summary = "summary",
}

export interface IStateInvestmentFlow {
  etoId: string | null;
  euroValueUlps: NumericString | null;
  ethValueUlps: NumericString | null;
  investmentType?: EInvestmentType;
  activeInvestmentTypes: EInvestmentType[];
  errorState?: EInvestmentErrorState;
  isValidatedInput: boolean;
  bankTransferFlowState?: EBankTransferFlowState;
  bankTransferGasStipend?: boolean;
  bankTransferReference: string | null;
}

export interface IBlInvestmentFlow {
  etoId: string;
  euroValueUlps: BigNumber;
  ethValueUlps: BigNumber;
  investmentType?: EInvestmentType;
  activeInvestmentTypes: EInvestmentType[];
  errorState?: EInvestmentErrorState;
  isValidatedInput: boolean;
  bankTransferFlowState?: EBankTransferFlowState;
  bankTransferGasStipend?: boolean;
  bankTransferReference: string;
}
