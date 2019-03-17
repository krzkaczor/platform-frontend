import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxSenderType } from "../../../../modules/tx/types";
import { ECurrency, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

const WithdrawTransactionDetails: TransactionDetailsComponent<ETxSenderType.WITHDRAW> = ({
  additionalData,
  className,
  txTimestamp,
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

    {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
  </InfoList>
);

export { WithdrawTransactionDetails };
