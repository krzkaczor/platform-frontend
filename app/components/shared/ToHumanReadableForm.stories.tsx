import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { ToHumanReadableForm } from "./ToHumanReadableForm";

storiesOf("ToHumanReadableForm", module)
  .add("one million", () => <ToHumanReadableForm number={new BigNumber(1000000)} />)
  .add("2 millions", () => <ToHumanReadableForm number={new BigNumber(2000000)} />)
  .add("5.5 millions", () => <ToHumanReadableForm number={new BigNumber(5500000)} />)
  .add("25 millions", () => <ToHumanReadableForm number={new BigNumber(25000000)} />)
  .add("one thousand", () => <ToHumanReadableForm number={new BigNumber(1000)} />)
  .add("2 thousands", () => <ToHumanReadableForm number={new BigNumber(2000)} />)
  .add("9.9 thousands", () => <ToHumanReadableForm number={new BigNumber(9900)} />)
  .add("125 thousands", () => <ToHumanReadableForm number={new BigNumber(125000)} />)
  .add("1", () => <ToHumanReadableForm number={new BigNumber(1)} />)
  .add("999", () => <ToHumanReadableForm number={new BigNumber(999)} />)
  .add("1.5 - 10 millions", () => (
    <ToHumanReadableForm number={new BigNumber(1500000)}>
      {divider => <ToHumanReadableForm number={new BigNumber(10000000)} divider={divider} />}
    </ToHumanReadableForm>
  ))
  .add("120 - 1000 thousands", () => (
    <ToHumanReadableForm number={new BigNumber(120000)}>
      {divider => <ToHumanReadableForm number={new BigNumber(1000000)} divider={divider} />}
    </ToHumanReadableForm>
  ))
  .add("500 - 20000", () => (
    <ToHumanReadableForm number={new BigNumber(500)}>
      {divider => <ToHumanReadableForm number={new BigNumber(20000)} divider={divider} />}
    </ToHumanReadableForm>
  ));
