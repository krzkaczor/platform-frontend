import * as cn from "classnames";
import * as React from "react";

import { TDataTestId, TTranslatedString } from "../../types";
import { ERoundingMode } from "../../utils/Money.utils";
import { makeTid } from "../../utils/tidUtils";
import { ECurrency, Money } from "./Money";

import * as styles from "./MoneySuiteWidget.module.scss";

export type TTheme = "light" | "framed";
export type TSize = "large";

export interface IMoneySuiteWidgetProps {
  icon: string;
  currency: ECurrency;
  currencyTotal: ECurrency;
  largeNumber: string;
  value: string;
  percentage?: string;
  theme?: TTheme;
  size?: TSize;
  walletName?: TTranslatedString;
}

// For now round down only nEUR
const selectRoundingMethod = (currency: ECurrency): ERoundingMode | undefined => {
  switch(currency) {
    case ECurrency.EUR_TOKEN:
    case ECurrency.ETH:
      return ERoundingMode.DOWN;

    default:
      return undefined;
  }
};

export const MoneySuiteWidget: React.FunctionComponent<IMoneySuiteWidgetProps & TDataTestId> = ({
  icon,
  currency,
  currencyTotal,
  largeNumber,
  value,
  percentage,
  "data-test-id": dataTestId,
  theme,
  size,
  walletName,
}) => (
  <div className={cn(styles.moneySuiteWidget, theme, size)}>
    <div>
      <img className={styles.icon} src={icon} alt="" />
      {walletName}
    </div>
    <div>
      <div className={styles.money} data-test-id={makeTid(dataTestId, "large-value")}>
        <Money
          value={largeNumber}
          currency={currency}
          roundingMode={selectRoundingMethod(currency)}
        />
      </div>
      <div className={styles.totalMoney} data-test-id={makeTid(dataTestId, "value")}>
        ={" "}
        <Money
          value={value}
          currency={currencyTotal}
          roundingMode={selectRoundingMethod(currency)}
        />
        {percentage && (
          <span className={`${parseInt(percentage, 10) > 0 ? styles.green : styles.red}`}>
            {" "}
            ({percentage}
            %)
          </span>
        )}
      </div>
    </div>
  </div>
);
