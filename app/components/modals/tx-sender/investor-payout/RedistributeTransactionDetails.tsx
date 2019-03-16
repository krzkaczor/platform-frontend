import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TRedistributePayoutAdditionalData } from "../../../../modules/tx/transactions/payout/redistribute/types";
import { TTxAdditionalData } from "../../../../modules/tx/types";
import { CommonHtmlProps } from "../../../../types";
import { Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

export interface ITxPendingProps {
  additionalData: TTxAdditionalData<TRedistributePayoutAdditionalData>;
}
const RedistributeTransactionDetails: React.FunctionComponent<
  ITxPendingProps & CommonHtmlProps
> = ({ additionalData, className }) => {
  const tokenDisbursal = additionalData.tokenDisbursals;

  return (
    <InfoList className={className}>
      <InfoRow
        key={tokenDisbursal.token}
        caption={<FormattedMessage id="investor-payout.redistribute.summary.total-redistributed" />}
        value={<Money value={tokenDisbursal.amountToBeClaimed} currency={tokenDisbursal.token} />}
      />
    </InfoList>
  );
};

export { RedistributeTransactionDetails };
