import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { ECurrency, selectCurrencyCode } from "../Money";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as nEurIcon from "../../../assets/img/nEUR_icon.svg";

const CurrencyIcon: React.FunctionComponent<{ currency: ECurrency } & CommonHtmlProps> = ({
  currency,
  className,
}) => {
  switch (currency) {
    case ECurrency.EUR_TOKEN:
      return (
        <img src={nEurIcon} alt={`${selectCurrencyCode(currency)} token`} className={className} />
      );
    case ECurrency.ETH:
      return (
        <img src={ethIcon} alt={`${selectCurrencyCode(currency)} token`} className={className} />
      );
    default:
      throw new Error(`Icon for currency ${currency} not found`);
  }
};

export { CurrencyIcon };
