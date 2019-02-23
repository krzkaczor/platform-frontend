import { storiesOf } from "@storybook/react";
import * as React from "react";
import { UnlockedETHWallet } from "./UnlockedETHWallet";
import BigNumber from "bignumber.js";

storiesOf("Unlocked ETH Wallet", module)
  .add("empty", () => (
    <UnlockedETHWallet
      depositEth={() => {}}
      withdrawEth={() => {}}
      address="0x"
      ethAmount={new BigNumber("0")}
      ethEuroAmount={new BigNumber("0")}
      totalEuroAmount={new BigNumber("0")}
    />
  ))
  .add("not empty", () => (
    <UnlockedETHWallet
      depositEth={() => {}}
      withdrawEth={() => {}}
      address="0x"
      ethAmount={new BigNumber("1")}
      ethEuroAmount={new BigNumber("1")}
      totalEuroAmount={new BigNumber("1")}
    />
  ));
