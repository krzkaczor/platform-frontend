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
  txData: {
    from: "0x0020d330ef4de5c07d4271e0a67e8fd67a21d523",
    gas: "0x7b0c",
    gasPrice: "0xb2d05e00",
    hash: "0xe0cbf82ceee3d0a84b762fccf7eefbb4744bf68a6c0e9038a7db57ec8f2346f4",
    input: "0x00",
    nonce: "0x0",
    status: "pending",
    to: "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988",
    value: "0x8ac7230489e80000",
    blockHash: undefined,
    blockNumber: undefined,
    chainId: undefined,
    transactionIndex: undefined,
  },
};

storiesOf("TxPending", module)
  .addDecorator(withModalBody())
  .add("default", () => <TxPendingLayout {...txData} />);
