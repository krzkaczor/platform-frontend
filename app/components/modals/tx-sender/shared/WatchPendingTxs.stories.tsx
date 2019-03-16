import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { WatchPendingTxs } from "./WatchPendingTxs";

const txData = {
  blockId: 4623487932,
  txHash: "af908098b968d7564564362c51836",
};

storiesOf("WatchPendingTxs", module)
  .addDecorator(withModalBody())
  .add("default", () => <WatchPendingTxs {...txData} />);
