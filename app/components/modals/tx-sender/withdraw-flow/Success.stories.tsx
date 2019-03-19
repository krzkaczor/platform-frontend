import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";

import { withMockedDate, withModalBody } from "../../../../utils/storybookHelpers";
import { WithdrawSuccessLayout } from "./Success";

const dummyNow = new Date("10/3/2019");
const date = moment.utc(dummyNow).subtract(1, "day");

const props = {
  txHash: "0xdb3c43a0cfc4e221ecb52655eab3c3b88ba521a",
  additionalData: {
    to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
    value: "5500000000000000000",
    cost: "123123123123123123123123",
  },
  txTimestamp: date.valueOf(),
};

storiesOf("Withdraw/Success", module)
  .addDecorator(withModalBody())
  .addDecorator(withMockedDate(dummyNow))
  .add("default", () => <WithdrawSuccessLayout {...props} />);
