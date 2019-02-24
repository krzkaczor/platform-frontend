import { NumericString } from "../../../types";

export interface IStateTokenPrice {
  loading: boolean;
  error?: string;
  tokenPriceData?: IStateTokenPriceData;
}

export interface IStateTokenPriceData {
  etherPriceEur: NumericString;
  neuPriceEur: NumericString;
  eurPriceEther: NumericString;
  priceOutdated: boolean;
}
