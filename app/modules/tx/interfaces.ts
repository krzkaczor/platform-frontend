import BigNumber from "bignumber.js";
import {TPendingTxs} from "../../lib/api/users/interfaces";

export interface IStateWithdrawDraftType {
  type: ETxSenderType.WITHDRAW;
  to: string;
  value: BigNumber;
}

export interface IInvestmentDraftType {
  type: ETxSenderType.INVEST;
}

export type IDraftType = IStateWithdrawDraftType | IInvestmentDraftType;

export enum ETxSenderType {
  WITHDRAW = "WITHDRAW",
  INVEST = "INVEST",
  UPGRADE = "UPGRADE",
  ETO_SET_DATE = "ETO_SET_DATE",
  USER_CLAIM = "USER_CLAIM",
  INVESTOR_ACCEPT_PAYOUT = "INVESTOR_ACCEPT_PAYOUT",
  INVESTOR_REDISTRIBUTE_PAYOUT = "INVESTOR_REDISTRIBUTE_PAYOUT",
}

export enum ETokenType {
  ETHER = "ETHER",
  EURO = "EURO",
}

export interface ITxMonitorState {
  txs: TPendingTxs;
}
