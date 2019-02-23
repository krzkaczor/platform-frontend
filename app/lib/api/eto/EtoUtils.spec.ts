import { expect } from "chai";

import BigNumber from "bignumber.js";
import { getInvestmentAmount, getShareAndTokenPrice } from "./EtoUtils";

describe("EtoUtils", () => {
  describe("getShareAndTokenPrice", () => {
    it("should return correct sharePrice and TokenPrice", () => {
      expect(
        getShareAndTokenPrice({
          preMoneyValuationEur: new BigNumber(1000),
          existingCompanyShares: new BigNumber(100),
          equityTokensPerShare: new BigNumber(100),
        }),
      ).to.deep.equal({ sharePrice: new BigNumber(10), tokenPrice: new BigNumber(0.1) });
    });

    it("should return sharePrice as 0 when one of argument is undefined or 0", () => {
      expect(
        getShareAndTokenPrice({ preMoneyValuationEur: new BigNumber(100), existingCompanyShares: undefined }),
      ).to.deep.equal({ sharePrice: 0, tokenPrice: 0 });
      expect(
        getShareAndTokenPrice({ preMoneyValuationEur: undefined, existingCompanyShares: new BigNumber(100 )}),
      ).to.deep.equal({ sharePrice: 0, tokenPrice: 0 });
      expect(
        getShareAndTokenPrice({
          preMoneyValuationEur: undefined,
          existingCompanyShares: new BigNumber(100),
          equityTokensPerShare: new BigNumber(100),
        }),
      ).to.deep.equal({ sharePrice: new BigNumber(0), tokenPrice: new BigNumber(0) });
    });
  });

  describe("getInvestmentAmount", () => {
    it("should calculate correctly minInvestmentAmount", () => {
      const { minInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: new BigNumber(1000),
        existingCompanyShares: new BigNumber(10),
        minimumNewSharesToIssue: new BigNumber(100),
        newSharesToIssue: undefined,
        newSharesToIssueInFixedSlots: new BigNumber(10),
        newSharesToIssueInWhitelist: new BigNumber(5),
        fixedSlotsMaximumDiscountFraction: new BigNumber(0.8),
        whitelistDiscountFraction: new BigNumber(0.5),
        publicDiscountFraction: new BigNumber(0),
      });

      expect(minInvestmentAmount.toString()).to.equal("8950");
    });

    it("should return minInvestmentAmount as 0 when minimumNewSharesToIssue is 0", () => {
      const { minInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: new BigNumber(1000),
        existingCompanyShares: new BigNumber(10),
        minimumNewSharesToIssue: new BigNumber(0),
        newSharesToIssue: undefined,
        newSharesToIssueInFixedSlots: new BigNumber(10),
        newSharesToIssueInWhitelist: new BigNumber(5),
        fixedSlotsMaximumDiscountFraction: new BigNumber(0.8),
        whitelistDiscountFraction: new BigNumber(0.5),
        publicDiscountFraction: new BigNumber(0),
      });

      expect(minInvestmentAmount.toString()).to.equal("0");
    });

    it("should calculate correctly investment amount", () => {
      let { minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: new BigNumber(1000),
        existingCompanyShares: new BigNumber(10),
        newSharesToIssue: new BigNumber(1000),
        minimumNewSharesToIssue: undefined,
        newSharesToIssueInFixedSlots: new BigNumber(10),
        newSharesToIssueInWhitelist: new BigNumber(5),
        fixedSlotsMaximumDiscountFraction: new BigNumber(0.8),
        whitelistDiscountFraction: new BigNumber(0.5),
        publicDiscountFraction: new BigNumber(0),
      });

      expect(maxInvestmentAmount.toString()).to.equal('98950');
      expect(minInvestmentAmount.toString()).to.equal('0');

      // general test case
      ({ minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: new BigNumber(125000000),
        existingCompanyShares: new BigNumber(40859),
        newSharesToIssue: new BigNumber(3652),
        minimumNewSharesToIssue: new BigNumber(1000),
        newSharesToIssueInFixedSlots: new BigNumber(2252),
        newSharesToIssueInWhitelist: new BigNumber(700),
        fixedSlotsMaximumDiscountFraction: new BigNumber(0.6),
        whitelistDiscountFraction: new BigNumber(0.4),
        publicDiscountFraction: new BigNumber(0),
      }));

      expect(Math.round(maxInvestmentAmount.toNumber())).to.equal(6182236);
      expect(Math.round(minInvestmentAmount.toNumber())).to.equal(1223721);

      // same terms but without whitelist
      ({ minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: new BigNumber(125000000),
        existingCompanyShares: new BigNumber(40859),
        newSharesToIssue: new BigNumber(2952),
        minimumNewSharesToIssue: new BigNumber(1000),
        newSharesToIssueInFixedSlots: new BigNumber(2252),
        newSharesToIssueInWhitelist: new BigNumber(0),
        fixedSlotsMaximumDiscountFraction: new BigNumber(0.6),
        whitelistDiscountFraction: new BigNumber(0.4),
        publicDiscountFraction: new BigNumber(0),
      }));

      expect(Math.round(maxInvestmentAmount.toNumber())).to.equal(4897330);
      expect(Math.round(minInvestmentAmount.toNumber())).to.equal(1223721);

      // no discounts
      ({ minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: new BigNumber(125000000),
        existingCompanyShares: new BigNumber(40859),
        newSharesToIssue: new BigNumber(3652),
        minimumNewSharesToIssue: new BigNumber(0),
        newSharesToIssueInFixedSlots: new BigNumber(2252),
        newSharesToIssueInWhitelist: new BigNumber(700),
        fixedSlotsMaximumDiscountFraction: new BigNumber(0),
        whitelistDiscountFraction: new BigNumber(0),
        publicDiscountFraction: new BigNumber(0),
      }));

      expect(Math.round(maxInvestmentAmount.toNumber())).to.equal(Math.round(3652 * (125000000 / 40859)));
      expect(Math.round(minInvestmentAmount.toNumber())).to.equal(0);

      // with public discount fraction
      ({ minInvestmentAmount, maxInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: new BigNumber(125000000),
        existingCompanyShares: new BigNumber(40859),
        newSharesToIssue: new BigNumber(3652),
        minimumNewSharesToIssue: new BigNumber(1000),
        newSharesToIssueInFixedSlots: new BigNumber(2252),
        newSharesToIssueInWhitelist: new BigNumber(700),
        fixedSlotsMaximumDiscountFraction: new BigNumber(0.6),
        whitelistDiscountFraction: new BigNumber(0.4),
        publicDiscountFraction: new BigNumber(0.2),
      }));

      expect(Math.round(maxInvestmentAmount.toNumber())).to.equal(
        Math.round(2755818.79 + 1284906.63 + 1713208.84),
      );
      expect(Math.round(minInvestmentAmount.toNumber())).to.equal(1223721);
    });

    it("should return maxInvestmentAmount as 0 when newSharesToIssue is 0", () => {
      const { minInvestmentAmount } = getInvestmentAmount({
        preMoneyValuationEur: new BigNumber(1000),
        existingCompanyShares: new BigNumber(10),
        newSharesToIssue: new BigNumber(0),
        minimumNewSharesToIssue: undefined,
        newSharesToIssueInFixedSlots: new BigNumber(10),
        newSharesToIssueInWhitelist: new BigNumber(5),
        fixedSlotsMaximumDiscountFraction: new BigNumber(0.8),
        whitelistDiscountFraction: new BigNumber(0.5),
        publicDiscountFraction: new BigNumber(0),
      });

      expect(minInvestmentAmount.toString()).to.equal("0");
    });
  });
});
