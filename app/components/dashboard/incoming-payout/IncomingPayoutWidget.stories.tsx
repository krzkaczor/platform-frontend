import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withMockedDate } from "../../../utils/storybookHelpers";
import { IncomingPayoutComponent } from "./IncomingPayoutWidget";

const dummyNow = new Date("2018-03-10T05:03:56+02:00");

storiesOf("IncomingPayoutWidget", module)
  .addDecorator(withMockedDate(dummyNow))
  .add("default", () => (
    <IncomingPayoutComponent
      etherTokenIncomingPayout={"128128120000000000000"}
      euroTokenIncomingPayout={"1.1000012812e+23"}
      incomingPayoutDone={() => action("Payout done")}
      isIncomingPayoutDone={false}
    />
  ))
  .add("payout finished", () => (
    <IncomingPayoutComponent
      etherTokenIncomingPayout={"128128120000000000000"}
      euroTokenIncomingPayout={"1.1000012812e+23"}
      incomingPayoutDone={() => action("Payout done")}
      isIncomingPayoutDone={true}
    />
  ));
