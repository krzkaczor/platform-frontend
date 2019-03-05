import * as React from "react";

import { multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { ERoundingMode } from "../../../../utils/Money.utils";
import {
  ECurrency,
  ECurrencySymbol,
  EMoneyFormat,
  getFormattedMoney,
  Money,
} from "../../../shared/Money";

const CalculatedFee: React.FunctionComponent<{ amount: string; bankFee: string }> = ({
  amount,
  bankFee,
}) => {
  const providedAmount = !isNaN(Number(amount))
    ? getFormattedMoney(amount, ECurrency.EUR, EMoneyFormat.FLOAT, false, ERoundingMode.HALF_UP)
    : 0;
  const calculatedFee = multiplyBigNumbers([providedAmount, bankFee]);

  return (
    <Money value={calculatedFee} currencySymbol={ECurrencySymbol.CODE} currency={ECurrency.EUR} />
  );
};

export { CalculatedFee };
