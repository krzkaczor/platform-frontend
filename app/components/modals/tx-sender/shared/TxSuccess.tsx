import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { Tx } from "../../../../lib/api/users/interfaces";
import {
  selectMonitoredTxAdditionalData,
  selectMonitoredTxData,
  selectMonitoredTxTimestamp,
} from "../../../../modules/tx/monitor/selectors";
import { TSpecificTransactionState } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { SpinningEthereum } from "../../../shared/ethererum";
import { Message } from "../../Message";
import { TxDetails } from "../TxDetails";
import { TxName } from "../TxName";
import { TxHashAndBlock } from "./TxHashAndBlock";

export interface IStateProps {
  txData?: Tx;
  txTimestamp?: number;
  additionalData?: TSpecificTransactionState["additionalData"];
}

export interface IExternalProps {
  blockId?: number;
  txHash?: string;
  type: TSpecificTransactionState["type"];
}

type TTxPendingLayoutProps = {
  txData?: Tx;
  blockId?: number;
  txHash?: string;
  txTimestamp?: number;
} & TSpecificTransactionState;

const TxSuccessLayout: React.FunctionComponent<TTxPendingLayoutProps> = props => (
  <Message
    data-test-id="modals.shared.tx-success.modal"
    image={<SpinningEthereum className="mb-3" />}
    title={
      <FormattedMessage
        id="tx-sender.tx-success.title"
        values={{ transaction: <TxName type={props.type} /> }}
      />
    }
    titleClassName="text-success"
    text={
      <FormattedMessage
        id="tx-sender.tx-success.description"
        values={{ transaction: <TxName type={props.type} /> }}
      />
    }
  >
    <TxDetails className="mb-3" {...props} />

    {props.txHash && <TxHashAndBlock txHash={props.txHash} blockId={props.blockId} />}
  </Message>
);

const TxSuccess = compose<TTxPendingLayoutProps, IExternalProps>(
  appConnect<IStateProps>({
    stateToProps: state => ({
      txData: selectMonitoredTxData(state),
      txTimestamp: selectMonitoredTxTimestamp(state),
      additionalData: selectMonitoredTxAdditionalData(state),
    }),
  }),
)(TxSuccessLayout);

export { TxSuccess, TxSuccessLayout };
