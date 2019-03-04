import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ECurrency, Money } from "../shared/Money";

import * as styles from "./TotalEuro.module.scss";

interface ITotalEuroProps {
  totalEurValue: string;
}

export const TotalEuro: React.FunctionComponent<ITotalEuroProps> = ({ totalEurValue }) => (
  <div className={styles.totalEuro}>
    <span className={styles.label}>
      <FormattedMessage id="wallet.total" />
    </span>
    <Money className={styles.money} currency={ECurrency.EUR} value={totalEurValue} />
  </div>
);
