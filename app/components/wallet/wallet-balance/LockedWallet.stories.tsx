import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { LockedWallet } from "./LockedWallet";

storiesOf("Locked Wallet", module)
  .add("Normal Wallet", () => (
    <LockedWallet
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
    <LockedWallet
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
    <LockedWallet
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
    <LockedWallet
      data={{
        ethAmount: new BigNumber("1"),
        ethEuroAmount: new BigNumber("1"),
        neuroAmount: new BigNumber("1"),
        neuroEuroAmount: new BigNumber("1"),
        totalEuroAmount: new BigNumber("0"),
      }}
    />
  ));
