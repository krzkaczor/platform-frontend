import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { externalRoutes } from "../../../../config/externalRoutes";
import { selectMonitoredTxAdditionalData } from "../../../../modules/tx/monitor/selectors";
import { ETransactionErrorType } from "../../../../modules/tx/sender/reducer";
import { ETxSenderType } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { ExternalLink } from "../../../shared/links/ExternalLink";
import { Message } from "../../Message";
import { TxDetails } from "../TxDetails";
import { TxName } from "../TxName";
import { TxHashAndBlock } from "./TxHashAndBlock";
import { IStateProps } from "./TxPending";

import * as failedImg from "../../../../assets/img/ether_fail.svg";
import * as styles from "./ErrorMessage.module.scss";

export interface IStateProps {
  additionalData?: any;
}

interface IProps {
  type: ETxSenderType;
  error?: ETransactionErrorType;
  blockId?: number;
  txHash?: string;
}

const getErrorMessageByType = (type?: ETransactionErrorType) => {
  switch (type) {
    case ETransactionErrorType.NOT_ENOUGH_NEUMARKS_TO_UNLOCK:
      return (
        <FormattedMessage id="modal.txsender.error-message.error-not-enough-neu-to-unlock.message" />
      );
    case ETransactionErrorType.ERROR_WHILE_WATCHING_TX:
      return <FormattedMessage id="modal.txsender.error-message.error-while-watching-tx" />;
    case ETransactionErrorType.FAILED_TO_GENERATE_TX:
      return <FormattedMessage id="modal.txsender.error-message.failed-to-generate-tx" />;
    case ETransactionErrorType.GAS_TOO_LOW:
      return <FormattedMessage id="modal.txsender.error-message.gas-too-low" />;
    case ETransactionErrorType.INVALID_CHAIN_ID:
      return <FormattedMessage id="modal.txsender.error-message.invalid-chain-id" />;
    case ETransactionErrorType.INVALID_RLP_TX:
      return <FormattedMessage id="modal.txsender.error-message.invalid-rlp-tx" />;
    case ETransactionErrorType.NOT_ENOUGH_ETHER_FOR_GAS:
      return <FormattedMessage id="modal.txsender.error-message.not-enough-ether-for-gas" />;
    case ETransactionErrorType.NONCE_TOO_LOW:
      return <FormattedMessage id="modal.txsender.error-message.nonce-too-low" />;
    case ETransactionErrorType.NOT_ENOUGH_FUNDS:
      return <FormattedMessage id="modal.txsender.error-message.not-enough-funds" />;
    case ETransactionErrorType.OUT_OF_GAS:
      return <FormattedMessage id="modal.txsender.error-message.out-of-gas" />;
    case ETransactionErrorType.REVERTED_TX:
      return <FormattedMessage id="modal.txsender.error-message.reverted-tx" />;
    case ETransactionErrorType.TOO_MANY_TX_IN_QUEUE:
      return <FormattedMessage id="modal.txsender.error-message.too-many-tx-in-queue" />;
    case ETransactionErrorType.TX_WAS_REJECTED:
      return <FormattedMessage id="modal.txsender.error-message.tx-was-rejected" />;
    case ETransactionErrorType.LEDGER_CONTRACTS_DISABLED:
      return <FormattedMessage id="modal.txsender.error-message.ledger-contracts-disabled" />;
    default:
      return (
        <FormattedMessage
          id="modal.shared.signing-message.transaction-error.text"
          values={{
            supportDesk: (
              <ExternalLink href={externalRoutes.neufundSupport}>
                <FormattedMessage id="support-desk.link.text" />
              </ExternalLink>
            ),
          }}
        />
      );
  }
};

const getErrorTitleByType = (type: ETxSenderType, error?: ETransactionErrorType) => {
  switch (error) {
    case ETransactionErrorType.NOT_ENOUGH_NEUMARKS_TO_UNLOCK:
      return (
        <FormattedMessage id="modal.txsender.error-message.error-not-enough-neu-to-unlock.title" />
      );
    default:
      return (
        <FormattedMessage
          id="modal.shared.signing-message.transaction-error.title"
          values={{ transaction: <TxName type={type} /> }}
        />
      );
  }
};

const ErrorMessageLayout: React.FunctionComponent<IProps & IStateProps> = ({
  type,
  error,
  additionalData,
  txHash,
  blockId,
}) => {
  return (
    <Message
      data-test-id="modals.shared.signing-message.modal"
      image={<img src={failedImg} className={cn(styles.eth, "mb-3")} alt="" />}
      title={getErrorTitleByType(type, error)}
      text={getErrorMessageByType(error)}
    >
      {additionalData && <TxDetails type={type} additionalData={additionalData} />}

      <TxHashAndBlock txHash={txHash} blockId={blockId} />
    </Message>
  );
};

const ErrorMessage = compose<IStateProps & IProps, IProps>(
  appConnect<IStateProps>({
    stateToProps: state => ({
      additionalData: selectMonitoredTxAdditionalData(state),
    }),
  }),
)(ErrorMessageLayout);

export { ErrorMessage };
