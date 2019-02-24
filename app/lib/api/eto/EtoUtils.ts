import BigNumber from "bignumber.js";

import { IBlPublicEtoData } from "../../../modules/eto-flow/interfaces/PublicEtoData";
import { TBlEtoWithCompanyAndContract } from "../../../modules/public-etos/interfaces/interfaces";

export const getInvestmentAmount = (
  eto: Partial<{
    newSharesToIssueInFixedSlots: BigNumber;
    newSharesToIssueInWhitelist: BigNumber;
    fixedSlotsMaximumDiscountFraction: BigNumber;
    whitelistDiscountFraction: BigNumber;
    publicDiscountFraction: BigNumber;
    preMoneyValuationEur: BigNumber;
    existingCompanyShares: BigNumber;
    equityTokensPerShare: BigNumber;
    minimumNewSharesToIssue: BigNumber;
    newSharesToIssue: BigNumber;
  }>,
) => {
  const { sharePrice } = getShareAndTokenPrice(eto);

  return {
    minInvestmentAmount: getMaxInvestmentAmountWithDiscount(
      eto,
      sharePrice,
      eto.minimumNewSharesToIssue,
    ),
    maxInvestmentAmount: getMaxInvestmentAmountWithDiscount(eto, sharePrice, eto.newSharesToIssue),
  };
};

export const getShareAndTokenPrice = ({
  preMoneyValuationEur = new BigNumber(0),
  existingCompanyShares = new BigNumber(0),
  equityTokensPerShare = new BigNumber(1),
}: {
  preMoneyValuationEur?: BigNumber;
  existingCompanyShares?: BigNumber;
  equityTokensPerShare?: BigNumber;
}): { sharePrice: BigNumber; tokenPrice: BigNumber } => {
  if (!existingCompanyShares.isZero() && preMoneyValuationEur && !preMoneyValuationEur.isZero()) {
    const sharePrice = preMoneyValuationEur.div(existingCompanyShares);
    return {
      sharePrice,
      tokenPrice: sharePrice.div(equityTokensPerShare),
    };
  }
  return {
    sharePrice: new BigNumber(0),
    tokenPrice: new BigNumber(0),
  };
};

//todo make it return two values instead of returning one and mutating another
const getMaxInvestmentAmountWithDiscount = (
  {
    newSharesToIssueInFixedSlots = new BigNumber(0),
    newSharesToIssueInWhitelist = new BigNumber(0),
    fixedSlotsMaximumDiscountFraction = new BigNumber(0),
    whitelistDiscountFraction = new BigNumber(0),
    publicDiscountFraction = new BigNumber(0),
  }: Partial<{
    newSharesToIssueInFixedSlots: BigNumber;
    newSharesToIssueInWhitelist: BigNumber;
    fixedSlotsMaximumDiscountFraction: BigNumber;
    whitelistDiscountFraction: BigNumber;
    publicDiscountFraction: BigNumber;
  }>,
  sharePrice: BigNumber = new BigNumber(0),
  shares: BigNumber = new BigNumber(0),
): BigNumber => {
  if (sharePrice.isZero() || shares.isZero()) {
    return new BigNumber(0);
  }

  let amount = new BigNumber(0);

  if (newSharesToIssueInFixedSlots.gt(0) && shares.gt(0)) {
    const minShares = newSharesToIssueInFixedSlots.gte(shares)
      ? newSharesToIssueInFixedSlots
      : shares;

    amount = minShares
      .mul(sharePrice)
      .mul(new BigNumber(1).minus(fixedSlotsMaximumDiscountFraction))
      .add(amount);
    shares = shares.minus(minShares);
  }

  if (newSharesToIssueInWhitelist.gt(0) && shares.gt(0)) {
    const minShares = newSharesToIssueInWhitelist.gte(shares)
      ? newSharesToIssueInWhitelist
      : shares;

    amount = minShares
      .mul(sharePrice)
      .mul(new BigNumber(1).minus(whitelistDiscountFraction))
      .add(amount);
    shares = shares.minus(minShares);
  }

  if (shares.gt(0)) {
    amount = shares
      .mul(sharePrice)
      .mul(new BigNumber(1).minus(publicDiscountFraction))
      .add(amount);
  }

  return amount;
};

export const getInvestmentCalculatedPercentage = (eto: IBlPublicEtoData): BigNumber => {
  return eto.newSharesToIssue.div(eto.minimumNewSharesToIssue).mul(100);
};

export const getCurrentInvestmentProgressPercentage = (
  eto: TBlEtoWithCompanyAndContract,
): BigNumber => {
  const totalTokensInt = eto.contract!.totalInvestment.totalTokensInt;

  return totalTokensInt.div(eto.minimumNewSharesToIssue.mul(eto.equityTokensPerShare)).mul(100);
};
