import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { WithdrawSuccess } from "./Success";

storiesOf("Animations/Success", module)
  .addDecorator(withModalBody())
  .add("default", () => <WithdrawSuccess txHash="tx-hash" />);
