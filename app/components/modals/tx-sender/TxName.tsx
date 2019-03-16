import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxSenderType } from "../../../modules/tx/types";

interface IProps {
  type: ETxSenderType;
}

/**
 * Generate transaction name used for title inside TxPending and TxError modals
 */
const TxName: React.FunctionComponent<IProps> = ({ type }) => {
  switch (type) {
    case ETxSenderType.WITHDRAW:
      return <FormattedMessage id="withdraw-flow.name" />;
    case ETxSenderType.INVESTOR_ACCEPT_PAYOUT:
      return <FormattedMessage id="investor-payout.accept.name" />;
    case ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <FormattedMessage id="investor-payout.redistribute.name" />;
    case ETxSenderType.USER_CLAIM:
      return <FormattedMessage id="modals.tx-sender.user-claim.title" />;
    case ETxSenderType.UNLOCK_FUNDS:
      return <FormattedMessage id="unlock-funds-flow.title" />;
    case ETxSenderType.ETO_SET_DATE:
      return <FormattedMessage id="eto.settings.eto-start-date.title" />;
    case ETxSenderType.INVEST:
      return <FormattedMessage id="investment-flow.title" />;
    case ETxSenderType.NEUR_WITHDRAW:
      return <FormattedMessage id="bank-transfer.redeem.title" />;
    default:
      return <>transaction</>;
  }
};

export { TxName };
