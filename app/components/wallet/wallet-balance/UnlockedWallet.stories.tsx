import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { UnlockedWallet } from "./UnlockedWallet";

storiesOf("Unlocked Wallet", module)
  .add("Normal Wallet", () => (
    <UnlockedWallet
      depositEth={() => {}}
      withdrawEth={() => {}}
      address="0x"
      data={{
        ethAmount: new BigNumber("0"),
        ethEuroAmount: new BigNumber("0"),
        neuroAmount: new BigNumber("0"),
        neuroEuroAmount: new BigNumber("0"),
        totalEuroAmount: new BigNumber("0"),
      }}
    />
  ))
  .add("With Eth only", () => (
    <UnlockedWallet
      depositEth={() => {}}
      withdrawEth={() => {}}
      address="0x"
      data={{
        ethAmount: new BigNumber("1"),
        ethEuroAmount: new BigNumber("1"),
        neuroAmount: new BigNumber("0"),
        neuroEuroAmount: new BigNumber("0"),
        totalEuroAmount: new BigNumber("0"),
      }}
    />
  ))
  .add("With Euro only", () => (
    <UnlockedWallet
      depositEth={() => {}}
      withdrawEth={() => {}}
      address="0x"
      data={{
        ethAmount: new BigNumber("0"),
        ethEuroAmount: new BigNumber("0"),
        neuroAmount: new BigNumber("1"),
        neuroEuroAmount: new BigNumber("1"),
        totalEuroAmount: new BigNumber("0"),
      }}
    />
  ))
  .add("With Both Values", () => (
    <UnlockedWallet
      depositEth={() => {}}
      withdrawEth={() => {}}
      address="0x"
      data={{
        ethAmount: new BigNumber("1"),
        ethEuroAmount: new BigNumber("1"),
        neuroAmount: new BigNumber("1"),
        neuroEuroAmount: new BigNumber("1"),
        totalEuroAmount: new BigNumber("0"),
      }}
    />
  ));
