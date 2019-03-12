import BigNumber from "bignumber.js";

import { ECurrency } from "../../components/shared/Money";
import { IEtoTokenData, TEtoWithCompanyAndContract } from "../public-etos/types";

export interface ITokenDisbursal {
  token: ECurrency;
  amountToBeClaimed: string;
  totalDisbursedAmount: string;
  timeToFirstDisbursalRecycle: number;
}

export interface IInvestorTicket {
  equivEurUlps: BigNumber;
  rewardNmkUlps: BigNumber;
  equityTokenInt: BigNumber;
  sharesInt: BigNumber;
  tokenPrice: BigNumber;
  neuRate: BigNumber;
  amountEth: BigNumber;
  amountEurUlps: BigNumber;
  claimedOrRefunded: boolean;
  usedLockedAccount: boolean;
}

export interface ICalculatedContribution {
  isWhitelisted: boolean;
  isEligible: boolean;
  minTicketEurUlps: BigNumber;
  maxTicketEurUlps: BigNumber;
  equityTokenInt: BigNumber;
  neuRewardUlps: BigNumber;
  maxCapExceeded: boolean;
}

export type TETOWithInvestorTicket = TEtoWithCompanyAndContract & {
  investorTicket: IInvestorTicket;
};

export type TETOWithTokenData = TEtoWithCompanyAndContract & {
  tokenData: IEtoTokenData;
};

export interface IIncomingPayoutsData {
  euroTokenIncomingPayoutValue: string;
  etherTokenIncomingPayoutValue: string;
}

export interface IIncomingPayouts {
  loading: boolean;
  data?: IIncomingPayoutsData;
  payoutDone: boolean;
}
