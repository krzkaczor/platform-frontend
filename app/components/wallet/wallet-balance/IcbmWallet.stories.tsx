import BigNumber from "bignumber.js";
import {storiesOf} from "@storybook/react";
import * as React from "react";

import {IcbmWallet} from "./IcbmWallet";

storiesOf("ICBM Wallet", module)
  .add("Normal Wallet", () => (
    <IcbmWallet
      onUpgradeEtherClick={() => {
      }}
      onUpgradeEuroClick={() => {
      }}
      data={{
        hasFunds: true,
        isEtherUpgradeTargetSet: true,
        isEuroUpgradeTargetSet: true,
        ethAmount: new BigNumber("0"),
        ethEuroAmount: new BigNumber("0"),
        neuroAmount: new BigNumber("0"),
        neuroEuroAmount: new BigNumber("0"),
        totalEuroAmount: new BigNumber("0"),
      }}
    />
  ))
  .add("With Eth only", () => (
    <IcbmWallet
      onUpgradeEtherClick={() => {
      }}
      onUpgradeEuroClick={() => {
      }}
      data={{
        hasFunds: true,
        isEtherUpgradeTargetSet: true,
        isEuroUpgradeTargetSet: true,
        ethAmount: new BigNumber("1"),
        ethEuroAmount: new BigNumber("1"),
        neuroAmount: new BigNumber("0"),
        neuroEuroAmount: new BigNumber("0"),
        totalEuroAmount: new BigNumber("0"),
      }}
    />
  ))
  .add("With Euro only", () => (
    <IcbmWallet
      onUpgradeEtherClick={() => {
      }}
      onUpgradeEuroClick={() => {
      }}
      data={{
        hasFunds: true,
        isEtherUpgradeTargetSet: true,
        isEuroUpgradeTargetSet: true,
        ethAmount: new BigNumber("0"),
        ethEuroAmount: new BigNumber("0"),
        neuroAmount: new BigNumber("1"),
        neuroEuroAmount: new BigNumber("1"),
        totalEuroAmount: new BigNumber("0"),
      }}
    />
  ))
  .add("With Both Values", () => (
    <IcbmWallet
      onUpgradeEtherClick={() => {
      }}
      onUpgradeEuroClick={() => {
      }}
      data={{
        hasFunds: true,
        isEtherUpgradeTargetSet: true,
        isEuroUpgradeTargetSet: true,
        ethAmount: new BigNumber("1"),
        ethEuroAmount: new BigNumber("1"),
        neuroAmount: new BigNumber("1"),
        neuroEuroAmount: new BigNumber("1"),
        totalEuroAmount: new BigNumber("0"),
      }}
    />
  ))
  .add("With Both Values But no Callback Function", () => (
    <IcbmWallet
      onUpgradeEtherClick={() => {}}
      onUpgradeEuroClick={() => {}}
      data={{
        hasFunds: true,
        isEtherUpgradeTargetSet: true,
        isEuroUpgradeTargetSet: true,
        ethAmount: new BigNumber("1"),
        ethEuroAmount: new BigNumber("1"),
        neuroAmount: new BigNumber("1"),
        neuroEuroAmount: new BigNumber("1"),
        totalEuroAmount: new BigNumber("0"),
      }}
    />
  ))
  .add("With Both Values and Callbacks but target not set", () => (
    <IcbmWallet
      onUpgradeEtherClick={() => {
      }}
      onUpgradeEuroClick={() => {
      }}
      data={{
        hasFunds: true,
        isEtherUpgradeTargetSet: false,
        isEuroUpgradeTargetSet: false,
        ethAmount: new BigNumber("1"),
        ethEuroAmount: new BigNumber("1"),
        neuroAmount: new BigNumber("1"),
        neuroEuroAmount: new BigNumber("1"),
        totalEuroAmount: new BigNumber("0"),
      }}
    />
  ));
