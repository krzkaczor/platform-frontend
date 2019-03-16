import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TClaimAdditionalData } from "../../../../modules/tx/transactions/claim/types";
import { TTxAdditionalData } from "../../../../modules/tx/types";
import { CommonHtmlProps } from "../../../../types";
import { ECurrency, ECurrencySymbol, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";

export interface ITxPendingProps {
  additionalData: TTxAdditionalData<TClaimAdditionalData>;
}
const ClaimTransactionDetails: React.FunctionComponent<ITxPendingProps & CommonHtmlProps> = ({
  children,
  additionalData,
  className,
}) => (
  <InfoList className={className}>
    <InfoRow
      caption={<FormattedMessage id="user-claim-flow.token-name" />}
      value={additionalData.tokenName}
    />

    <InfoRow
      caption={<FormattedMessage id="user-claim-flow.balance" />}
      value={additionalData.tokenQuantity}
    />

    <InfoRow
      caption={<FormattedMessage id="user-claim-flow.estimated-reward" />}
      value={
        <Money
          value={additionalData.neuRewardUlps}
          currency={ECurrency.NEU}
          currencySymbol={ECurrencySymbol.NONE}
        />
      }
    />

    <InfoRow
      caption={<FormattedMessage id="upgrade-flow.transaction-cost" />}
      value={<Money currency={ECurrency.ETH} value={additionalData.costUlps} />}
    />

    {additionalData.timestamp && <TimestampRow timestamp={additionalData.timestamp} />}

    {children}
  </InfoList>
);

export { ClaimTransactionDetails };
