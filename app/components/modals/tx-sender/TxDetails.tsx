import * as React from "react";

import { Tx } from "../../../lib/api/users/interfaces";
import { ETxSenderType } from "../../../modules/tx/types";
import { AcceptTransactionDetails } from "./investor-payout/AcceptTransactionDetails";
import { UpgradeTransactionDetails } from "./upgrade-flow/UpgradeTransactionDetails";
import { ClaimTransactionDetails } from "./user-claim/ClaimTransactionDetails";
import { WithdrawTransactionDetails } from "./withdraw-flow/WithdrawTransactionDetails";

interface IProps {
  additionalData?: any;
  type: ETxSenderType;
  txData: Readonly<Tx>;
}

const TxDetails: React.FunctionComponent<IProps> = ({ type, additionalData, txData }) => {
  switch (type) {
    case ETxSenderType.INVESTOR_ACCEPT_PAYOUT:
      return additionalData && <AcceptTransactionDetails additionalData={additionalData} />;
    case ETxSenderType.USER_CLAIM:
      return additionalData && <ClaimTransactionDetails additionalData={additionalData} />;
    case ETxSenderType.WITHDRAW:
      return additionalData && <WithdrawTransactionDetails additionalData={additionalData} />;
    case ETxSenderType.UPGRADE:
      return <UpgradeTransactionDetails txData={txData} />;
    default:
      return null;
  }
};

export { TxDetails };
