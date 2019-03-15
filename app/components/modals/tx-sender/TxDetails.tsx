import * as React from "react";

import { Tx } from "../../../lib/api/users/interfaces";
import { ETxSenderType } from "../../../modules/tx/types";
import { SetDateDetails } from "./eto-flow/SetDateDetails";
import { AcceptTransactionDetails } from "./investor-payout/AcceptTransactionDetails";
import { RedistributeTransactionDetails } from "./investor-payout/RedistributeTransactionDetails";
import { UnlockWalletTransactionDetails } from "./unlock-wallet-flow/UnlockWalletTransactionDetails";
import { UpgradeTransactionDetails } from "./upgrade-flow/UpgradeTransactionDetails";
import { ClaimTransactionDetails } from "./user-claim/ClaimTransactionDetails";
import { WithdrawTransactionDetails } from "./withdraw-flow/WithdrawTransactionDetails";

interface IProps {
  additionalData?: any;
  type: ETxSenderType;
  txData: Readonly<Tx>;
}

const TxDetails: React.FunctionComponent<IProps> = ({ type, additionalData, txData }) => {
  // wait for transaction data
  if (!txData) {
    return null;
  }

  switch (type) {
    case ETxSenderType.INVESTOR_ACCEPT_PAYOUT:
      return <AcceptTransactionDetails additionalData={additionalData} />;
    case ETxSenderType.USER_CLAIM:
      return <ClaimTransactionDetails additionalData={additionalData} />;
    case ETxSenderType.WITHDRAW:
      return <WithdrawTransactionDetails additionalData={additionalData} />;
    case ETxSenderType.UPGRADE:
      return <UpgradeTransactionDetails txData={txData} />;
    case ETxSenderType.UNLOCK_FUNDS:
      return <UnlockWalletTransactionDetails txData={txData} additionalData={additionalData} />;
    case ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <RedistributeTransactionDetails additionalData={additionalData} />;
    case ETxSenderType.ETO_SET_DATE:
      return <SetDateDetails additionalData={additionalData} />;
    default:
      return null;
  }
};

export { TxDetails };
