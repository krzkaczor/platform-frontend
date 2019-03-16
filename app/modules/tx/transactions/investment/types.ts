export type TInvestmentAdditionalData = {
  eto: {
    etoId: string;
    companyName: string;
    existingCompanyShares: number;
    preMoneyValuationEur: number;
    equityTokensPerShare: number;
  };
  equityTokens: string;
  estimatedReward: string;
  etherPriceEur: string;
  gasCostEth: string;
  investmentEth: string;
  investmentEur: string;
  isIcbm: boolean;
};
