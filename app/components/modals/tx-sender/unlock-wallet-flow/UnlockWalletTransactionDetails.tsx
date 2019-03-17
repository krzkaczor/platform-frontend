import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, lifecycle, withState } from "recompose";

import { PLATFORM_UNLOCK_FEE } from "../../../../config/constants";
import { ETxSenderType } from "../../../../modules/tx/types";
import { getUnlockedWalletEtherAmountAfterFee } from "../../../../modules/wallet/utils";
import { multiplyBigNumbers } from "../../../../utils/BigNumberUtils";
import { getCurrentUTCTimestamp } from "../../../../utils/Date.utils";
import { ECurrency, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { TimestampRow } from "../shared/TimestampRow";
import { TransactionDetailsComponent } from "../types";

export type TTxPendingProps = React.ComponentProps<
  TransactionDetailsComponent<ETxSenderType.UNLOCK_FUNDS>
>;

interface IAdditionalProps {
  returnedEther: BigNumber;
  updateReturnedFunds: (returnedEther: BigNumber) => void;
}

const UnlockWalletTransactionDetailsLayout: React.FunctionComponent<
  TTxPendingProps & IAdditionalProps
> = ({ txData, additionalData, returnedEther, className, txTimestamp }) => (
  <InfoList className={className}>
    <InfoRow
      caption={<FormattedMessage id="unlock-funds-flow.eth-committed" />}
      value={<Money currency={ECurrency.ETH} value={additionalData.lockedEtherBalance} />}
    />
    <InfoRow
      caption={<FormattedMessage id="unlock-funds-flow.neumarks-due" />}
      value={<Money currency={ECurrency.NEU} value={additionalData.etherNeumarksDue} />}
    />
    <InfoRow
      caption={
        <FormattedMessage
          id="unlock-funds-flow.fee"
          values={{
            fee: PLATFORM_UNLOCK_FEE * 100,
          }}
        />
      }
      value={null}
    />
    <InfoRow
      caption={<FormattedMessage id="unlock-funds-flow.amount-returned" />}
      value={<Money currency={ECurrency.ETH} value={returnedEther} />}
    />
    <InfoRow
      caption={<FormattedMessage id="unlock-funds-flow.transaction-cost" />}
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

const UnlockWalletTransactionDetails = compose<
  TTxPendingProps & IAdditionalProps,
  React.ComponentProps<TransactionDetailsComponent<ETxSenderType.UNLOCK_FUNDS>>
>(
  withState("returnedEther", "updateReturnedFunds", 0),
  lifecycle<TTxPendingProps & IAdditionalProps, {}>({
    componentDidUpdate(): void {
      const { updateReturnedFunds, additionalData } = this.props;
      const { lockedEtherUnlockDate, lockedEtherBalance } = additionalData;
      setTimeout(() => {
        updateReturnedFunds(
          getUnlockedWalletEtherAmountAfterFee(
            new BigNumber(lockedEtherBalance),
            // TODO: Remove with https://github.com/Neufund/platform-frontend/issues/2156
            lockedEtherUnlockDate,
            getCurrentUTCTimestamp(),
          ),
        );
      }, 1000);
    },
  }),
)(UnlockWalletTransactionDetailsLayout);

export { UnlockWalletTransactionDetails };
