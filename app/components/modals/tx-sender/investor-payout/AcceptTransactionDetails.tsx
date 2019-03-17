import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxSenderType } from "../../../../modules/tx/types";
import { Money, selectCurrencyCode } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

const AcceptTransactionDetails: TransactionDetailsComponent<
  ETxSenderType.INVESTOR_ACCEPT_PAYOUT
> = ({ additionalData, className, txTimestamp }) => (
  <InfoList className={className}>
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
    {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
  </InfoList>
);

export { AcceptTransactionDetails };
