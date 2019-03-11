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
    default:
      return <>transaction</>;
  }
};

export { TxName };
