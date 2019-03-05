import { expect } from "chai";

import { ERoundingMode, formatMoney } from "./Money.utils";

describe("Money utils", () => {
  describe("formatMoney", () => {
    it("should format money", () => {
      expect(formatMoney("10000", 2, 2)).to.be.eq("100.00");
      expect(formatMoney("10000", 5, 2)).to.be.eq("0.10");
      expect(formatMoney("100000000000000000000", 1, 1)).to.be.eq("10000000000000000000.0");
    });

    it("should correctly round", () => {
      expect(formatMoney("10.888", 0, 2, ERoundingMode.UP)).to.be.eq("10.89");
      expect(formatMoney("10.882", 0, 2, ERoundingMode.UP)).to.be.eq("10.89");
      expect(formatMoney("10.888", 0, 2, ERoundingMode.DOWN)).to.be.eq("10.88");
      expect(formatMoney("10.888", 0, 2, ERoundingMode.HALF_UP)).to.be.eq("10.89");
      expect(formatMoney("10.882", 0, 2, ERoundingMode.HALF_UP)).to.be.eq("10.88");
      expect(formatMoney("10.888", 0, 2, ERoundingMode.HALF_DOWN)).to.be.eq("10.89");
      expect(formatMoney("10.882", 0, 2, ERoundingMode.HALF_DOWN)).to.be.eq("10.88");
    });
  });
});
