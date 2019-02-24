import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import * as Yup from "yup";

import { ECurrency, ECurrencySymbol, EMoneyFormat, Money } from "../../components/shared/Money";

const MaxPledgeAboveMax = ({ maxPledge }: { maxPledge: number }) => (
  <FormattedMessage
    id="shared-component.eto-overview.error.max-pledge"
    values={{
      maxPledge: (
        <Money
          value={maxPledge}
          currency={ECurrency.EUR}
          format={EMoneyFormat.FLOAT}
          currencySymbol={ECurrencySymbol.SYMBOL}
        />
      ),
    }}
  />
);

const PledgeBelowMin = ({ minPledge }: { minPledge: number }) => (
  <FormattedMessage
    id="shared-component.eto-overview.error.min-pledge"
    values={{
      minPledge: (
        <Money
          value={minPledge}
          currency={ECurrency.EUR}
          format={EMoneyFormat.FLOAT}
          currencySymbol={ECurrencySymbol.SYMBOL}
        />
      ),
    }}
  />
);

export const generateCampaigningValidator = (minPledge: number, maxPledge?: number) => {
  const amount = Yup.number()
    .min(minPledge, <PledgeBelowMin minPledge={minPledge} /> as any)
    .integer()
    .required();

  return Yup.object({
    amount: maxPledge
      ? amount.max(maxPledge, <MaxPledgeAboveMax maxPledge={maxPledge} /> as any)
      : amount,
  });
};
