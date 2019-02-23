import { expect } from "chai";
import { Q18 } from "../../config/constants";
import { IAppState } from "../../store";
import {NumericString} from "../../types";
import {
  selectICBMLockedEuroTotalAmount,
  selectLiquidEuroTotalAmount,
  selectLockedEuroTotalAmount,
  selectNeuBalance,
  selectNeuBalanceEuroAmount,
  selectTotalEtherBalance,
  selectTotalEtherBalanceEuroAmount,
  selectTotalEuroBalance,
  selectTotalEuroTokenBalance,
} from "./selectors";

describe("Wallet > selectors", () => {
  it("should calculate total value correctly", () => {
    const state = {
      wallet: {
        loading: false,
        data: {
          etherTokenLockedWallet: {
            LockedBalance: Q18.mul(23.11).toString() as NumericString,
            neumarksDue: "0" as NumericString,
            unlockDate: "0",
          },
          euroTokenLockedWallet: {
            LockedBalance: Q18.mul(18.11).toString() as NumericString,
            neumarksDue: "0" as NumericString,
            unlockDate: "0",
          },

          etherTokenICBMLockedWallet: {
            LockedBalance: Q18.mul(50).toString() as NumericString,
            neumarksDue: "0" as NumericString,
            unlockDate: "0",
          },
          euroTokenICBMLockedWallet: {
            LockedBalance: Q18.mul(5).toString() as NumericString,
            neumarksDue: "0" as NumericString,
            unlockDate: "0",
          },
          etherTokenBalance: Q18.mul(10).toString() as NumericString,
          euroTokenBalance: Q18.mul(10.12).toString() as NumericString,
          etherBalance: Q18.mul(100).toString() as NumericString,
          neuBalance: Q18.mul(1000).toString() as NumericString,
        },
      },
      tokenPrice: {
        tokenPriceData: {
          etherPriceEur: "10" as NumericString,
          neuPriceEur: "10000" as NumericString,
        },
      },
    };

    const fullStateMock = (state as any) as IAppState;

    const totalEther = Q18.mul(10 + 23.11 + 50 + 100);
    expect(selectTotalEtherBalance(fullStateMock)).to.be.eq(totalEther.toString());

    expect(selectTotalEtherBalanceEuroAmount(fullStateMock)).to.be.eq(
      totalEther.mul(10).toString(),
    );

    const totalEuro = Q18.mul(10.12 + 5 + 18.11);
    expect(selectTotalEuroTokenBalance(fullStateMock)).to.be.eq(totalEuro.toString());

    expect(selectLiquidEuroTotalAmount(fullStateMock)).to.be.eq(
      Q18.mul(10.12)
        .add(Q18.mul(100 + 10).mul(10))
        .toString(),
    );

    expect(selectLockedEuroTotalAmount(fullStateMock)).to.be.eq(
      Q18.mul(18.11)
        .add(Q18.mul(23.11).mul(10))
        .toString(),
    );

    expect(selectICBMLockedEuroTotalAmount(fullStateMock)).to.be.eq(
      Q18.mul(5 + 50 * 10).toString(),
    );

    expect(selectTotalEuroBalance(fullStateMock)).to.be.eq(
      totalEther
        .mul(10)
        .add(totalEuro)
        .toString(),
    );

    expect(selectNeuBalance(state.wallet)).to.eq(Q18.mul(1000));
    expect(selectNeuBalanceEuroAmount(fullStateMock)).to.eq(
      Q18.mul(1000)
        .mul(10000)
        .toString(),
    );
  });
});
