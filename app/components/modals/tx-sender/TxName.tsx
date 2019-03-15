import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxSenderType } from "../../../modules/tx/types";

interface IProps {
  type: ETxSenderType;
}

const TxName: React.FunctionComponent<IProps> = ({ type }) => {
  switch (type) {
    case ETxSenderType.WITHDRAW:
      return <FormattedMessage id="withdraw-flow.name" />;
    case ETxSenderType.INVESTOR_ACCEPT_PAYOUT:
      return <FormattedMessage id="investor-payout.accept.name" />;
    case ETxSenderType.USER_CLAIM:
      return <FormattedMessage id="modals.tx-sender.user-claim.title" />;
    default:
      return <>transaction</>;
  }
};

export { TxName };
