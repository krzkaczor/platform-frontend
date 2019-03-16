import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TWithdrawAdditionalData } from "../../../../modules/tx/transactions/withdraw/types";
import { TTxAdditionalData } from "../../../../modules/tx/types";
import { CommonHtmlProps } from "../../../../types";
import { ECurrency, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";

export interface ITxPendingProps {
  additionalData: TTxAdditionalData<TWithdrawAdditionalData>;
}
const WithdrawTransactionDetails: React.FunctionComponent<ITxPendingProps & CommonHtmlProps> = ({
  additionalData,
  className,
}) => (
  <InfoList className={className}>
    <InfoRow
      caption={<FormattedMessage id="withdraw-flow.to" />}
      value={additionalData.to}
      data-test-id="modals.tx-sender.withdraw-flow.summary.to"
    />

    <InfoRow
      caption={<FormattedMessage id="withdraw-flow.value" />}
      value={<Money currency={ECurrency.ETH} value={additionalData.value} />}
      data-test-id="modals.tx-sender.withdraw-flow.summary.value"
    />

    <InfoRow
      caption={<FormattedMessage id="withdraw-flow.transaction-cost" />}
      value={<Money currency={ECurrency.ETH} value={additionalData.cost} />}
      data-test-id="modals.tx-sender.withdraw-flow.summary.cost"
    />

    {additionalData.timestamp && <TimestampRow timestamp={additionalData.timestamp} />}
  </InfoList>
);

export { WithdrawTransactionDetails };
