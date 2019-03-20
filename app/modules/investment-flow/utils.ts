import { ECurrency } from "../../components/shared/Money";
import { EInvestmentType } from "./reducer";

export const getCurrencyByInvestmentType = (type: EInvestmentType) => {
  switch (type) {
    case EInvestmentType.NEur:
    case EInvestmentType.ICBMnEuro:
      return ECurrency.EUR_TOKEN;
    case EInvestmentType.Eth:
    case EInvestmentType.ICBMEth:
      return ECurrency.ETH;
  }
};
