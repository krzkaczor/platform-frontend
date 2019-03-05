import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Q18 } from "../../../../config/constants";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { UnlockFundsSummaryComponent } from "./Summary";

storiesOf("Upgrade Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <UnlockFundsSummaryComponent
      txCost={"123456"}
      onAccept={action("Accept Summary")}
      neumarksDue="123"
      etherLockedBalance={Q18.mul(1234).toString()}
      returnedEther={Q18.mul(10)}
      unlockDate={"1569888000"}
      updateReturnedFunds={() => {}}
    />
  ));
