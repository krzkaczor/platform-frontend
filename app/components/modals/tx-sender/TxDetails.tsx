import * as React from "react";

import { Tx } from "../../../lib/api/users/interfaces";
import { ETxSenderType, TSpecificTransactionState } from "../../../modules/tx/types";
import { CommonHtmlProps } from "../../../types";
import { SetDateDetails } from "./eto-flow/SetDateDetails";
import { InvestmentTransactionDetails } from "./investment-flow/InvestmentTransactionDetails";
import { AcceptTransactionDetails } from "./investor-payout/AcceptTransactionDetails";
import { RedistributeTransactionDetails } from "./investor-payout/RedistributeTransactionDetails";
import { BankTransferRedeemDetails } from "./redeem/BankTransferRedeemDetails";
import { UnlockWalletTransactionDetails } from "./unlock-wallet-flow/UnlockWalletTransactionDetails";
import { UpgradeTransactionDetails } from "./upgrade-flow/UpgradeTransactionDetails";
import { ClaimTransactionDetails } from "./user-claim/ClaimTransactionDetails";
import { WithdrawTransactionDetails } from "./withdraw-flow/WithdrawTransactionDetails";

type IProps = {
  txData?: Readonly<Tx>;
} & TSpecificTransactionState;

/**
 * Generate transaction details used inside general TxPending and TxError modals
 * @note If there are no details return `null` explicitly
 */
const TxDetails: React.FunctionComponent<IProps & CommonHtmlProps> = props => {
  // wait for transaction data
  if (!props.txData) {
    return null;
  }

  switch (props.type) {
    case ETxSenderType.INVESTOR_ACCEPT_PAYOUT:
      return <AcceptTransactionDetails {...props} />;
    case ETxSenderType.USER_CLAIM:
      return <ClaimTransactionDetails {...props} />;
    case ETxSenderType.WITHDRAW:
      return <WithdrawTransactionDetails {...props} />;
    case ETxSenderType.UPGRADE:
      return <UpgradeTransactionDetails {...props as any} />;
    case ETxSenderType.UNLOCK_FUNDS:
      return <UnlockWalletTransactionDetails {...props as any} />;
    case ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <RedistributeTransactionDetails {...props} />;
    case ETxSenderType.ETO_SET_DATE:
      return <SetDateDetails {...props} />;
    case ETxSenderType.INVEST:
      return <InvestmentTransactionDetails {...props} />;
    case ETxSenderType.NEUR_REDEEM:
      return <BankTransferRedeemDetails {...props} />;
    case ETxSenderType.SIGN_INVESTMENT_AGREEMENT:
      return null;
  }
};

export { TxDetails };
