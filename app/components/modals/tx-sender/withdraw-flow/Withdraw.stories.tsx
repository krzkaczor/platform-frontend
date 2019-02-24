import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { dummyIntl } from "../../../../utils/injectIntlHelpers.fixtures";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { WithdrawLayout } from "./Withdraw";

storiesOf("Withdraw", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <WithdrawLayout
      onAccept={() => {}}
      maxEther={new BigNumber("100000000000000000000000000000")}
      onValidateHandler={() => {}}
      intl={dummyIntl}
    />
  ));
