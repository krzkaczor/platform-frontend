import * as cn from "classnames";
import * as React from "react";

import { TDataTestId } from "../../types";
import { makeTid } from "../../utils/tidUtils";
import { ECurrency, Money } from "./Money";

import BigNumber from "bignumber.js";
import * as styles from "./MoneySuiteWidget.module.scss";

export type TTheme = "light";
export type TSize = "large";

export interface IMoneySuiteWidgetProps {
  icon: string;
  currency: ECurrency;
  currencyTotal: ECurrency;
  largeNumber: BigNumber;
  value: BigNumber;
  percentage?: BigNumber;
  theme?: TTheme;
  size?: TSize;
}

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
}) => (
    <div className={cn(styles.moneySuiteWidget, theme, size)}>
      <img className={styles.icon} src={icon} alt="" />
      <div>
        <div className={styles.money} data-test-id={makeTid(dataTestId, "-large-value")}>
          <Money value={largeNumber} currency={currency} />
        </div>
        <div className={styles.totalMoney} data-test-id={makeTid(dataTestId, "-value")}>
          = <Money value={value} currency={currencyTotal} />
          {percentage && (
            <span className={`${percentage.gt(0) ? styles.green : styles.red}`}>
              {" "}
              ({percentage.toString(10)}
              %)
            </span>
          )}
        </div>
      </div>
    </div>
);
