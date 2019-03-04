import { expect } from "chai";

import { getTriggerPoint } from "../RainbowSheepTip";

describe("getTriggerPoint", () => {
  const breakpoints = {
    200: 1000,
    480: 1500,
    700: 2000,
  };
  const defaultValue = 5000;

  it("should work for minimum breakpoint", () => {
    const windowWidth = 100;

    const actual = getTriggerPoint(windowWidth, breakpoints, defaultValue);

    expect(actual).to.be.eq(1000);
  });

  it("should work for middle breakpoint", () => {
    const windowWidth = 500;

    const actual = getTriggerPoint(windowWidth, breakpoints, defaultValue);

    expect(actual).to.be.eq(2000);
  });

  it("should work for default value", () => {
    const windowWidth = 800;

    const actual = getTriggerPoint(windowWidth, breakpoints, defaultValue);

    expect(actual).to.be.eq(5000);
  });
});
