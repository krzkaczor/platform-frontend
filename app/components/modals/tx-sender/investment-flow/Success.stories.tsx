import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { InvestmentSuccessComponent } from "./Success";

storiesOf("Investment/Success", module)
  .addDecorator(withModalBody())
  .add("default", () => <InvestmentSuccessComponent goToPortfolio={() => {}} txHash="tx-hash" />);
