import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Modal } from "reactstrap";

import { actions } from "../../../modules/actions";
import { ETxSenderType } from "../../../modules/tx/interfaces";
import { ETransactionErrorType, ETxSenderState } from "../../../modules/tx/sender/interfaces";
import { selectTxSenderModalOpened } from "../../../modules/tx/sender/selectors";
import { IBlTxData } from "../../../modules/web3/interfaces";
import { appConnect } from "../../../store";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { ModalComponentBody } from "../ModalComponentBody";
import { AccessWalletContainer } from "../wallet-access/AccessWalletModal";
import { SetEtoDateSummary } from "./eto-flow/SetDateSummary";
import { InvestmentSelection } from "./investment-flow/Investment";
import { InvestmentSuccess } from "./investment-flow/Success";
import { InvestmentSummary } from "./investment-flow/Summary";
import { InvestorAcceptPayoutSuccess } from "./investor-payout/AcceptSuccess";
import { InvestorAcceptPayoutSummary } from "./investor-payout/AcceptSummary";
import { InvestorRedistributePayoutConfirm } from "./investor-payout/RedistributeConfirm";
import { InvestorRedistributePayoutSuccess } from "./investor-payout/RedistributeSuccess";
import { InvestorRedistributePayoutSummary } from "./investor-payout/RedistributeSummary";
import { ErrorMessage } from "./shared/ErrorMessage";
import { SigningMessage } from "./shared/SigningMessage";
import { TxPending } from "./shared/TxPending";
import { WatchPendingTxs } from "./shared/WatchPeningTxs";
import { UpgradeSummary } from "./upgrade-flow/Summary";
import { UserClaimSuccess } from "./user-claim/Success";
import { UserClaimSummary } from "./user-claim/Summary";
import { WithdrawSuccess } from "./withdraw-flow/Success";
import { WithdrawSummary } from "./withdraw-flow/Summary";
import { Withdraw } from "./withdraw-flow/Withdraw";

interface IStateProps {
  isOpen: boolean;
  state: ETxSenderState;
  type?: ETxSenderType;
  details?: IBlTxData;
  blockId?: number;
  txHash?: string;
  error?: ETransactionErrorType;
}

interface IDispatchProps {
  onCancel: () => any;
}

type Props = IStateProps & IDispatchProps;

function isBigModal(props: Props): boolean {
  return props.state === ETxSenderState.INIT && props.type === ETxSenderType.INVEST;
}

const TxSenderModalComponent: React.FunctionComponent<Props> = props => {
  const { isOpen, onCancel } = props;

  return (
    <Modal isOpen={isOpen} toggle={onCancel} className={cn({ big: isBigModal(props) })}>
      <ModalComponentBody onClose={onCancel}>
        <TxSenderBody {...props} />
      </ModalComponentBody>
    </Modal>
  );
};

const InitComponent: React.FunctionComponent<{ type?: ETxSenderType }> = ({ type }) => {
  switch (type) {
    case ETxSenderType.INVEST:
      return <InvestmentSelection />;
    case ETxSenderType.WITHDRAW:
      return <Withdraw />;
    case ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <InvestorRedistributePayoutConfirm />;
    default:
      return <LoadingIndicator />;
  }
};

const SummaryComponent: React.FunctionComponent<{ type?: ETxSenderType }> = ({ type }) => {
  switch (type) {
    case ETxSenderType.INVEST:
      return <InvestmentSummary />;
    case ETxSenderType.ETO_SET_DATE:
      return <SetEtoDateSummary />;
    case ETxSenderType.UPGRADE:
      return <UpgradeSummary />;
    case ETxSenderType.USER_CLAIM:
      return <UserClaimSummary />;
    case ETxSenderType.INVESTOR_ACCEPT_PAYOUT:
      return <InvestorAcceptPayoutSummary />;
    case ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <InvestorRedistributePayoutSummary />;
    default:
      return <WithdrawSummary />;
  }
};

const SuccessComponent: React.FunctionComponent<{ type?: ETxSenderType; txHash?: string }> = ({
  type,
  txHash,
}) => {
  switch (type) {
    case ETxSenderType.INVEST:
      return <InvestmentSuccess txHash={txHash!} />;
    case ETxSenderType.USER_CLAIM:
      return <UserClaimSuccess />;
    case ETxSenderType.INVESTOR_ACCEPT_PAYOUT:
      return <InvestorAcceptPayoutSuccess />;
    case ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <InvestorRedistributePayoutSuccess />;
    default:
      return <WithdrawSuccess txHash={txHash!} />;
  }
};

const TxSenderBody: React.FunctionComponent<Props> = ({ state, blockId, txHash, type, error }) => {
  switch (state) {
    case ETxSenderState.WATCHING_PENDING_TXS:
      return <WatchPendingTxs txHash={txHash} blockId={blockId} />;

    case ETxSenderState.INIT:
      if (!type) {
        throw new Error("Transaction type needs to be set at transaction init state");
      }
      return <InitComponent type={type} />;

    case ETxSenderState.SUMMARY:
      return <SummaryComponent type={type!} />;

    case ETxSenderState.ACCESSING_WALLET:
      return (
        <AccessWalletContainer
          title={<FormattedMessage id="modals.tx-sender.confirm-title" />}
          message={<FormattedMessage id="modals.tx-sender.confirm-description" />}
        />
      );

    case ETxSenderState.SIGNING:
      return <SigningMessage />;

    case ETxSenderState.MINING:
      return <TxPending blockId={blockId!} txHash={txHash!} type={type!} />;

    case ETxSenderState.DONE:
      return <SuccessComponent type={type} txHash={txHash!} />;

    case ETxSenderState.ERROR_SIGN:
      return <ErrorMessage type={error} />;

    default:
      return null;
  }
};

const TxSenderModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: selectTxSenderModalOpened(state),
    state: state.txSender.state,
    type: state.txSender.type,
    txHash: state.txSender.txHash,
    blockId: state.txSender.blockId,
    error: state.txSender.error,
  }),
  dispatchToProps: d => ({
    onCancel: () => d(actions.txSender.txSenderHideModal()),
  }),
})(TxSenderModalComponent);

export { TxSenderModal, TxSenderModalComponent };
