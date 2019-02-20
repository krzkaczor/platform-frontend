import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import * as Yup from "yup";

import { ECurrency, ECurrencySymbol, EMoneyFormat, Money } from "../../../components/shared/Money";

export interface IPledge {
  amountEur: number;
  currency: ECurrency.EUR_TOKEN;
  consentToRevealEmail: boolean;
}

export interface IBookBuildingStats {
  investorsCount: number;
  pledgedAmount: number;
}

export const generateCampaigningValidation = (minPledge: number, maxPledge?: number) => {
  const amount = Yup.number()
    .typeError(<FormattedMessage id="form.field.error.number.integer" /> as any)
    .min(minPledge, (
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
    ) as any)
    .integer()
    .required();

  return Yup.object({
    amount: maxPledge
      ? amount.max(maxPledge, (
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
        ) as any)
      : amount,
  });
};
