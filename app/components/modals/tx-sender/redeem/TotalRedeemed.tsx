import * as React from "react";

import { Q18 } from "../../../../config/constants";
import { multiplyBigNumbers, subtractBigNumbers } from "../../../../utils/BigNumberUtils";
import { ERoundingMode } from "../../../../utils/Money.utils";
import {
  ECurrency,
  ECurrencySymbol,
  EMoneyFormat,
  getFormattedMoney,
  Money,
} from "../../../shared/Money";

const TotalRedeemed: React.FunctionComponent<{ amount: string; bankFee: string }> = ({
  amount,
  bankFee,
}) => {
  const providedAmount = !isNaN(Number(amount))
    ? getFormattedMoney(amount, ECurrency.EUR, EMoneyFormat.FLOAT, false, ERoundingMode.HALF_UP)
    : 0;

  const calculatedFee = multiplyBigNumbers([providedAmount, bankFee]);
  const totalRedeemed = subtractBigNumbers([Q18.mul(providedAmount), calculatedFee]);

  return (
    <Money
      value={totalRedeemed}
      currencySymbol={ECurrencySymbol.CODE}
      currency={ECurrency.EUR}
      roundingMode={ERoundingMode.DOWN}
    />
  );
};

export { TotalRedeemed };
