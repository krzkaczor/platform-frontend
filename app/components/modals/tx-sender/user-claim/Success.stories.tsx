import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { UserClaimSuccessComponent } from "./Success";

storiesOf("User Claim success", module)
  .addDecorator(withModalBody())
  .add("default", () => <UserClaimSuccessComponent goToPortfolio={() => {}} tokenName="test" />);
