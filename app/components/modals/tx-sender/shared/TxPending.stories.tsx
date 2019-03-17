import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ETxSenderType } from "../../../../modules/tx/types";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { TxPendingLayout } from "./TxPending";

const txData: React.ComponentProps<typeof TxPendingLayout> = {
  blockId: 4623487932,
  txHash: "af908098b968d7564564362c51836",
  type: ETxSenderType.WITHDRAW,
  additionalData: {
    to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
    value: "5500000000000000000",
    cost: "313131232312331212",
  },
  // TODO: place correct params
  txData: {
    to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
    value: "5500000000000000000",
    gas: "12000",
    gasPrice: "57000000000",
    from: "0x8e75544b848f0a32a1ab119e3916ec7138f3bed2",
    hash: "0x8e75544b848f0a32a1ab119e3916ec7138f3bed2",
    input: "",
    nonce: "1",
    blockHash: "31312",
    blockNumber: "312312",
    chainId: "fdfds",
    transactionIndex: "1",
    status: undefined,
  },
};

storiesOf("TxPending", module)
  .addDecorator(withModalBody())
  .add("default", () => <TxPendingLayout {...txData} />);
