import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { ITxData } from "../../../../lib/web3/types";
import { selectMonitoredTxTimestamp } from "../../../../modules/tx/monitor/selectors";
import { selectTxAdditionalData, selectTxDetails } from "../../../../modules/tx/sender/selectors";
import { TSpecificTransactionState } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { SpinningEthereum } from "../../../shared/ethererum";
import { Message } from "../../Message";
import { TxDetails } from "../TxDetails";
import { TxName } from "../TxName";
import { TxHashAndBlock } from "./TxHashAndBlock";

export interface IStateProps {
  txData?: ITxData;
  txTimestamp?: number;
  additionalData?: TSpecificTransactionState["additionalData"];
}

export interface ITxPendingProps {
  blockId?: number;
  txHash?: string;
  type: TSpecificTransactionState["type"];
}

type TTxPendingLayoutProps = {
  txData?: ITxData;
  blockId?: number;
  txHash?: string;
  txTimestamp?: number;
} & TSpecificTransactionState;

const TxPendingLayout: React.FunctionComponent<TTxPendingLayoutProps> = props => (
  <Message
    data-test-id="modals.shared.tx-pending.modal"
    image={<SpinningEthereum className="mb-3" />}
    title={
      <FormattedMessage
        id="tx-sender.tx-pending.title"
        values={{ transaction: <TxName type={props.type} /> }}
      />
    }
    text={<FormattedMessage id="tx-sender.tx-pending.description" />}
  >
    <TxDetails className="mb-3" {...props} />

    {props.txHash && <TxHashAndBlock txHash={props.txHash} blockId={props.blockId} />}
  </Message>
);

const TxPending = compose<TTxPendingLayoutProps, ITxPendingProps>(
  appConnect<IStateProps>({
    stateToProps: state => ({
      txData: selectTxDetails(state),
      txTimestamp: selectMonitoredTxTimestamp(state),
      additionalData: selectTxAdditionalData(state),
    }),
  }),
)(TxPendingLayout);

export { TxPending, TxPendingLayout };
