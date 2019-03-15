import * as React from "react";

import { ETxSenderType } from "../../../modules/tx/types";
import { AcceptTransactionDetails } from "./investor-payout/AcceptTransactionDetails";
import { ClaimTransactionDetails } from "./user-claim/ClaimTransactionDetails";
import { WithdrawTransactionDetails } from "./withdraw-flow/WithdrawTransactionDetails";

interface IProps {
  additionalData: any;
  type: ETxSenderType;
}

const TxDetails: React.FunctionComponent<IProps> = ({ type, additionalData }) => {
  switch (type) {
    case ETxSenderType.INVESTOR_ACCEPT_PAYOUT:
      return <AcceptTransactionDetails additionalData={additionalData} />;
    case ETxSenderType.USER_CLAIM:
      return <ClaimTransactionDetails additionalData={additionalData} />;
    case ETxSenderType.WITHDRAW:
      return <WithdrawTransactionDetails additionalData={additionalData} />;
    default:
      return null;
  }
};

export { TxDetails };
