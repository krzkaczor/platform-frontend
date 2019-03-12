import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { MONEY_DECIMALS } from "../../../../config/constants";
import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import { selectInvestmentActiveTypes } from "../../../../modules/investment-flow/selectors";
import { EValidationState } from "../../../../modules/tx/sender/reducer";
import {
  selectLiquidEtherBalance,
  selectLiquidEtherBalanceEuroAmount,
  selectLiquidEuroTokenBalance,
  selectLockedEtherBalance,
  selectLockedEtherBalanceEuroAmount,
  selectLockedEuroTokenBalance,
} from "../../../../modules/wallet/selectors";
import { IAppState } from "../../../../store";
import { Dictionary } from "../../../../types";
import { divideBigNumbers } from "../../../../utils/BigNumberUtils";
import { formatMoney } from "../../../../utils/Money.utils";
import { formatThousands } from "../../../../utils/Number.utils";
import { WalletSelectionData } from "./InvestmentTypeSelector";

export function createWallets(state: IAppState): WalletSelectionData[] {
  const icbmNeuro = selectLockedEuroTokenBalance(state);
  const balanceNEur = selectLiquidEuroTokenBalance(state);

  const wallets: Dictionary<WalletSelectionData> = {
    [EInvestmentType.Eth]: {
      balanceEth: selectLiquidEtherBalance(state),
      balanceEur: selectLiquidEtherBalanceEuroAmount(state),
      type: EInvestmentType.Eth,
      name: "Eth Wallet",
    },
    [EInvestmentType.NEur]: {
      balanceNEuro: balanceNEur,
      balanceEur: balanceNEur,
      type: EInvestmentType.NEur,
      name: "nEuro Wallet",
    },
    [EInvestmentType.ICBMnEuro]: {
      type: EInvestmentType.ICBMnEuro,
      name: "ICBM Wallet",
      balanceNEuro: icbmNeuro,
      balanceEur: icbmNeuro,
    },
    [EInvestmentType.ICBMEth]: {
      type: EInvestmentType.ICBMEth,
      name: "ICBM Wallet",
      balanceEth: selectLockedEtherBalance(state),
      balanceEur: selectLockedEtherBalanceEuroAmount(state),
    },
  };

  return selectInvestmentActiveTypes(state).map(t => wallets[t]);
}

export function getInputErrorMessage(
  type: EInvestmentErrorState | EValidationState | undefined,
  tokenName: string,
  maxTicketEur: string,
  minTicketEur: string,
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
          values={{ maxAmount: `€${maxTicketEur || 0}` }}
        />
      );
    case EInvestmentErrorState.BelowMinimumTicketSize:
      return (
        <FormattedMessage
          id="investment-flow.error-message.below-minimum-ticket-size"
          values={{ minAmount: `€${minTicketEur || 0}` }}
        />
      );
    case EInvestmentErrorState.ExceedsWalletBalance:
      return <FormattedMessage id="investment-flow.error-message.exceeds-wallet-balance" />;
    case EValidationState.NOT_ENOUGH_ETHER_FOR_GAS:
      return <FormattedMessage id="modal.txsender.error-message.not-enough-ether-for-gas" />;
  }
}

/**
 * @deprecated Use Money component
 */
export function formatEur(val?: string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 2);
}

/**
 * @deprecated Use Money component
 */
export function formatEurTsd(val?: string | BigNumber): string | undefined {
  return formatThousands(formatEur(val));
}

/**
 * @deprecated Use Money component
 */
export function formatEth(val?: string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS, 4);
}

/**
 * @deprecated Use Money component
 */
export function formatEthTsd(val?: string | BigNumber): string | undefined {
  return formatThousands(formatEth(val));
}

/**
 * @deprecated Use Money component
 */
export function formatVaryingDecimals(val?: string | BigNumber): string | undefined {
  return val && formatMoney(val, MONEY_DECIMALS);
}

export function getActualTokenPriceEur(
  investmentEurUlps: string,
  equityTokenCount: string | number,
): string {
  return formatMoney(divideBigNumbers(investmentEurUlps, equityTokenCount), MONEY_DECIMALS, 8);
}

export const formatSummaryTokenPrice = (fullTokenPrice: string, actualTokenPrice: string) => {
  const discount = new BigNumber(1)
    .sub(new BigNumber(actualTokenPrice).div(new BigNumber(fullTokenPrice)))
    .mul(100)
    .round(0, 4);
  let priceString = formatThousands(actualTokenPrice.toString());
  if (discount.gte(1)) {
    priceString += ` (-${discount}%)`;
  }
  return priceString;
};
