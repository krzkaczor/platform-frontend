import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TAcceptPayoutAdditionalData } from "../../../../modules/tx/transactions/payout/accept/types";
import { TTxAdditionalData } from "../../../../modules/tx/types";
import { Money, selectCurrencyCode } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";

export interface ITxPendingProps {
  additionalData: TTxAdditionalData<TAcceptPayoutAdditionalData>;
}
const AcceptTransactionDetails: React.FunctionComponent<ITxPendingProps> = ({ additionalData }) => (
  <InfoList className="mb-4">
    {additionalData.tokensDisbursals.map(disbursal => (
      <InfoRow
        data-test-id={`investor-payout.accept-summary.${disbursal.token}-total-payout`}
        key={disbursal.token}
        caption={
          <FormattedMessage
            id="investor-payout.accept.summary.total-payout"
            values={{ token: selectCurrencyCode(disbursal.token) }}
          />
        }
        value={<Money value={disbursal.amountToBeClaimed} currency={disbursal.token} />}
      />
    ))}
    {additionalData.timestamp && <TimestampRow timestamp={additionalData.timestamp} />}
  </InfoList>
);

export { AcceptTransactionDetails };
