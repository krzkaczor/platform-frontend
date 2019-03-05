import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { withMockedDate } from "../../../../utils/storybookHelpers";
import { ChooseEtoStartDateWidgetComponent } from "./ChooseEtoStartDateWidget";

const TEST_OFFSET_PERIOD = 604800; //7 days

const data = {
  setEtoDate: () => {},
  uploadDate: () => {},
  minOffsetPeriod: new BigNumber(TEST_OFFSET_PERIOD),
};

const dummyNow = new Date("2021-12-31T05:03:56.000Z");

storiesOf("ETO-Flow/ChooseEtoStartDateWidget", module)
  .addDecorator(withMockedDate(dummyNow))
  .add("starting date haven't been set yet", () => <ChooseEtoStartDateWidgetComponent {...data} />)
  .add("starting date may be changed", () => (
    <ChooseEtoStartDateWidgetComponent {...data} etoDate={new Date("2028-12-20")} />
  ))
  .add("starting date cannot be changed anymore", () => (
    <ChooseEtoStartDateWidgetComponent {...data} etoDate={new Date("2018-12-24")} />
  ));
