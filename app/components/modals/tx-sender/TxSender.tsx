import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Modal } from "reactstrap";

import { ITxData } from "../../../lib/web3/types";
import { actions } from "../../../modules/actions";
import { ETransactionErrorType, ETxSenderState } from "../../../modules/tx/sender/reducer";
import { selectTxSenderModalOpened } from "../../../modules/tx/sender/selectors";
import { ETxSenderType } from "../../../modules/tx/types";
import { appConnect } from "../../../store";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { QuintessenceModal } from "../bank-transfer-flow/QuintessenceModal";
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
import { BankTransferRedeemInit } from "./redeem/BankTransferRedeemInit";
import { BankTransferRedeemSuccess } from "./redeem/BankTransferRedeemSuccess";
import { BankTransferRedeemSummary } from "./redeem/BankTransferRedeemSummary";
import { ErrorMessage } from "./shared/ErrorMessage";
import { SigningMessage } from "./shared/SigningMessage";
import { TxPending } from "./shared/TxPending";
import { WatchPendingTxs } from "./shared/WatchPeningTxs";
import { UnlockWalletSummary } from "./unlock-wallet-flow/Summary";
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
  details?: ITxData;
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

const TxSenderModalSelect: React.FunctionComponent<Props> = props => {
  if (props.type !== ETxSenderType.NEUR_WITHDRAW) {
    return <TxSenderModalOuter {...props}>{props.children}</TxSenderModalOuter>;
  }

  switch (props.state) {
    case ETxSenderState.INIT:
    case ETxSenderState.SUMMARY:
    case ETxSenderState.DONE:
      return (
        <QuintessenceModal isOpen={props.isOpen} onClose={props.onCancel}>
          {props.children}
        </QuintessenceModal>
      );
    default:
      return <TxSenderModalOuter {...props}>{props.children}</TxSenderModalOuter>;
  }
};

const TxSenderModalOuter: React.FunctionComponent<Props> = props => (
  <Modal isOpen={props.isOpen} toggle={props.onCancel} className={cn({ big: isBigModal(props) })}>
    <ModalComponentBody onClose={props.onCancel}>{props.children}</ModalComponentBody>
  </Modal>
);

const TxSenderModalComponent: React.FunctionComponent<Props> = props => (
  <TxSenderModalSelect {...props}>
    <TxSenderBody {...props} />
  </TxSenderModalSelect>
);

const InitComponent: React.FunctionComponent<{ type?: ETxSenderType }> = ({ type }) => {
  switch (type) {
    case ETxSenderType.INVEST:
      return <InvestmentSelection />;
    case ETxSenderType.WITHDRAW:
      return <Withdraw />;
    case ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <InvestorRedistributePayoutConfirm />;
    case ETxSenderType.NEUR_WITHDRAW:
      return <BankTransferRedeemInit />;
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
    case ETxSenderType.UNLOCK_FUNDS:
      return <UnlockWalletSummary />;
    case ETxSenderType.NEUR_WITHDRAW:
      return <BankTransferRedeemSummary />;
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
    case ETxSenderType.NEUR_WITHDRAW:
      return <BankTransferRedeemSuccess txHash={txHash!} />;
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
      if (!type) {
        throw new Error("Transaction type needs to be set at transaction mining state");
      }

      return <TxPending blockId={blockId} txHash={txHash} type={type} />;

    case ETxSenderState.DONE:
      return <SuccessComponent type={type} txHash={txHash!} />;

    case ETxSenderState.ERROR_SIGN:
      if (!type) {
        throw new Error("Transaction type needs to be set at transaction error state");
      }

      return <ErrorMessage blockId={blockId} txHash={txHash} type={type} error={error} />;

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
