import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { assertNever } from "../../../utils/assertNever";
import { ECurrency, selectCurrencyCode } from "../Money";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as eurIcon from "../../../assets/img/euro_icon.svg";
import * as neuIcon from "../../../assets/img/neu_icon.svg";
import * as nEurIcon from "../../../assets/img/nEUR_icon.svg";

const getIconForCurrency = (currency: ECurrency) => {
  switch (currency) {
    case ECurrency.EUR_TOKEN:
      return nEurIcon;
    case ECurrency.EUR:
      return eurIcon;
    case ECurrency.ETH:
      return ethIcon;
    case ECurrency.NEU:
      return neuIcon;
    default:
      assertNever(currency);
  }
};

const CurrencyIcon: React.FunctionComponent<{ currency: ECurrency } & CommonHtmlProps> = ({
  currency,
  className,
}) => (
  <img
    src={getIconForCurrency(currency)}
    alt={`${selectCurrencyCode(currency)} token`}
    className={className}
  />
);

export { CurrencyIcon };
