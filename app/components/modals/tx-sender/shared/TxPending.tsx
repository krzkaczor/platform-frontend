import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { Tx } from "../../../../lib/api/users/interfaces";
import {
  selectMonitoredTxAdditionalData,
  selectMonitoredTxData,
} from "../../../../modules/tx/monitor/selectors";
import { ETxSenderType } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { SpinningEthereum } from "../../../shared/ethererum";
import { Message } from "../../Message";
import { TxDetails } from "../TxDetails";
import { TxName } from "../TxName";
import { TxHashAndBlock } from "./TxHashAndBlock";

export interface IStateProps {
  txData?: Tx;
  additionalData?: any;
}

export interface ITxPendingProps {
  blockId?: number;
  txHash?: string;
  type: ETxSenderType;
}

const TxPendingLayout: React.FunctionComponent<ITxPendingProps & IStateProps> = ({
  blockId,
  txHash,
  type,
  additionalData,
  txData,
}) => (
  <Message
    data-test-id="modals.shared.tx-pending.modal"
    image={<SpinningEthereum className="mb-3" />}
    title={
      <FormattedMessage
        id="tx-sender.tx-pending.title"
        values={{ transaction: <TxName type={type} /> }}
      />
    }
    text={<FormattedMessage id="tx-sender.tx-pending.description" />}
  >
    <TxDetails
      className="mb-3"
      txData={txData}
      type={type as any}
      additionalData={additionalData}
    />

    <TxHashAndBlock txHash={txHash} blockId={blockId} />
  </Message>
);

const TxPending = compose<IStateProps & ITxPendingProps, ITxPendingProps>(
  appConnect<IStateProps>({
    stateToProps: state => ({
      txData: selectMonitoredTxData(state),
      additionalData: selectMonitoredTxAdditionalData(state),
    }),
  }),
)(TxPendingLayout);

export { TxPending, TxPendingLayout };
