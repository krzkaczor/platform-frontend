import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { MONEY_DECIMALS } from "../../../../config/constants";
import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/interfaces";
import { selectInvestmentActiveTypes } from "../../../../modules/investment-flow/selectors";
import { EValidationState } from "../../../../modules/tx/sender/interfaces";
import {
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectLockedEtherBalance,
  selectLockedEtherBalanceEuroAmount,
  selectLockedEuroTokenBalance,
} from "../../../../modules/wallet/selectors";
import { IAppState } from "../../../../store";
import { Dictionary } from "../../../../types";
import { formatMoney } from "../../../../utils/Money.utils";
import { formatThousands } from "../../../../utils/Number.utils";
import { WalletSelectionData } from "./InvestmentTypeSelector";

import * as ethIcon from "../../../../assets/img/eth_icon.svg";
import * as neuroIcon from "../../../../assets/img/nEUR_icon.svg";

export function createWallets(state: IAppState): WalletSelectionData[] {
  const w = state.wallet;
  const icbmEther = selectLockedEtherBalance(w);
  const icbmNeuro = selectLockedEuroTokenBalance(w);

  const wallets: Dictionary<WalletSelectionData> = {
    [EInvestmentType.InvestmentWallet]: {
      balanceEth: selectLiquidEtherBalance(w),
      balanceEur: selectLiquidEtherBalanceEuroAmount(state),
      type: EInvestmentType.InvestmentWallet,
      name: "Investment Wallet",
      icon: ethIcon,
    },
    [EInvestmentType.ICBMnEuro]: {
      type: EInvestmentType.ICBMnEuro,
      name: "ICBM Wallet",
      balanceNEuro: icbmNeuro,
      balanceEur: icbmNeuro,
      icon: neuroIcon,
    },
    [EInvestmentType.ICBMEth]: {
      type: EInvestmentType.ICBMEth,
      name: "ICBM Wallet",
      balanceEth: icbmEther,
      balanceEur: selectLockedEtherBalanceEuroAmount(state),
      icon: ethIcon,
    },
  };

  return selectInvestmentActiveTypes(state).map(t => wallets[t]);
}

export function getInputErrorMessage(
  type: EInvestmentErrorState | EValidationState | undefined,
  tokenName: string,
  maxTicketEur: BigNumber,
  minTicketEur: BigNumber,
): React.ReactElement<FormattedMessage.Props> | undefined {
  switch (type) {
    case EInvestmentErrorState.ExceedsTokenAmount:
      return (
        <FormattedMessage
          id="investment-flow.error-message.exceeds-token-amount"
          values={{ tokenName }}
        />
      );
    case EInvestmentErrorState.AboveMaximumTicketSize:
      return (
        <FormattedMessage
          id="investment-flow.error-message.above-maximum-ticket-size"
          values={{ maxAmount: `€${maxTicketEur.toNumber() || 0}` }}
        />
      );
    case EInvestmentErrorState.BelowMinimumTicketSize:
      return (
        <FormattedMessage
          id="investment-flow.error-message.below-minimum-ticket-size"
          values={{ minAmount: `€${minTicketEur.toNumber() || 0}` }}
        />
      );
    case EInvestmentErrorState.ExceedsWalletBalance:
      return <FormattedMessage id="investment-flow.error-message.exceeds-wallet-balance" />;
    case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS:
      return <FormattedMessage id="modal.txsender.error-message.not-enough-ether-for-gas" />;
  }
}

export function getInvestmentTypeMessages(type?: EInvestmentType): React.ReactNode {
  switch (type) {
    case EInvestmentType.BankTransfer:
      return (
        <FormattedHTMLMessage
          id="investment-flow.bank-transfer-info-message"
          tagName="p"
          values={{ href: `${externalRoutes.neufundSupport}/home` }}
        />
      );
  }
}

/**
 * @deprecated Use Money component
 */
export function formatEur(val?: BigNumber | null): string | undefined {
  return val ? formatMoney(val, MONEY_DECIMALS, 2) : "";
}

/**
 * @deprecated Use Money component
 */
export function formatEurTsd(val?: BigNumber | null): string {
  return formatThousands(formatEur(val));
}

/**
 * @deprecated Use Money component
 */
export function formatEth(val?: BigNumber | null): string {
  return val ? formatMoney(val, MONEY_DECIMALS, 4) : "";
}

/**
 * @deprecated Use Money component
 */
export function formatEthTsd(val?: BigNumber | null): string {
  return formatThousands(formatEth(val));
}

/**
 * @deprecated Use Money component
 */
export function formatVaryingDecimals(val?: BigNumber): string {
  return val ? formatMoney(val, MONEY_DECIMALS) : "";
}

export function getActualTokenPriceEur( //  // formatMoney(investmentEurUlps.div(equityTokenCount), MONEY_DECIMALS, 8)
  investmentEurUlps: BigNumber,
  equityTokenCount: BigNumber,
): BigNumber {
  return investmentEurUlps.div(equityTokenCount);
}

export const formatSummaryTokenPrice = (fullTokenPrice: BigNumber, actualTokenPrice?: BigNumber | null):string => {
  if(!fullTokenPrice || !actualTokenPrice){
    return ''
  }

  const discount = new BigNumber(1)
    .sub(actualTokenPrice.div(fullTokenPrice))
    .mul(100)
    .round(0, 4);
  let priceString = formatThousands(actualTokenPrice.toString());
  if (discount.gte(1)) {
    priceString += ` (-${discount}%)`;
  }
  return priceString;
};
