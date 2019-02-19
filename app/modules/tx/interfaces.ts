export interface IWithdrawDraftType {
  type: ETxSenderType.WITHDRAW;
  to: string;
  value: string;
}

export interface IInvestmentDraftType {
  type: ETxSenderType.INVEST;
}

export type IDraftType = IWithdrawDraftType | IInvestmentDraftType;

export enum ETxSenderType {
  WITHDRAW = "WITHDRAW",
  INVEST = "INVEST",
  UPGRADE = "UPGRADE",
  ETO_SET_DATE = "ETO_SET_DATE",
  SIGN_INVESTMENT_AGREEMENT = "SIGN_INVESTMENT_AGREEMENT",
  USER_CLAIM = "USER_CLAIM",
  INVESTOR_ACCEPT_PAYOUT = "INVESTOR_ACCEPT_PAYOUT",
  INVESTOR_REDISTRIBUTE_PAYOUT = "INVESTOR_REDISTRIBUTE_PAYOUT",
}

export enum ETokenType {
  ETHER = "ETHER",
  EURO = "EURO",
}
