import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Tx } from "../../../../lib/api/users/interfaces";
import { ITxData } from "../../../../lib/web3/types";
import { ETxSenderType } from "../../../../modules/tx/types";
import { multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { ECurrency, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

export interface ITxPendingProps {
  txData: Readonly<ITxData> | Readonly<Tx>;
}
const UpgradeTransactionDetails: TransactionDetailsComponent<ETxSenderType.UPGRADE> = ({
  txData,
  className,
  txTimestamp,
}) => (
  <InfoList className={className}>
    <InfoRow caption={<FormattedMessage id="upgrade-flow.to" />} value={txData!.to} />

    <InfoRow
      caption={<FormattedMessage id="upgrade-flow.value" />}
      value={<Money currency={ECurrency.ETH} value={txData!.value} />}
    />

    <InfoRow
      caption={<FormattedMessage id="upgrade-flow.transaction-cost" />}
      value={
        <Money
          currency={ECurrency.ETH}
          value={multiplyBigNumbers([txData!.gasPrice, txData!.gas])}
        />
      }
    />

    {txTimestamp && <TimestampRow timestamp={txTimestamp} />}
  </InfoList>
);

export { UpgradeTransactionDetails };
