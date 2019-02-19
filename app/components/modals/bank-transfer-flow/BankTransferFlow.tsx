import * as React from "react";
import { Modal } from "reactstrap";

import { actions } from "../../../modules/actions";
import { EBankTransferFlowState } from "../../../modules/bank-transfer-flow/reducer";
import {
  selectBankTransferFlowState,
  selectIsBankTransferModalOpened,
} from "../../../modules/bank-transfer-flow/selectors";
import { appConnect } from "../../../store";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { ModalComponentBody } from "../ModalComponentBody";
import { BankTransferDetails } from "./BankTransferDetails";
import { BankTransferSuccess } from "./BankTransferSuccess";

interface IStateProps {
  isOpen: boolean;
  state: EBankTransferFlowState;
}

interface IDispatchProps {
  onCancel: () => any;
}

type Props = IStateProps & IDispatchProps;

const BankTransferFlowModalLayout: React.FunctionComponent<Props> = props => {
  const { isOpen, onCancel } = props;

  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalComponentBody onClose={onCancel}>
        <BankTransferFlowBody {...props} />
      </ModalComponentBody>
    </Modal>
  );
};

const BankTransferFlowBody: React.FunctionComponent<Props> = ({ state }) => {
  switch (state) {
    case EBankTransferFlowState.INIT:
      return <LoadingIndicator />;
    case EBankTransferFlowState.DETAILS:
      return <BankTransferDetails />;
    case EBankTransferFlowState.SUMMARY:
      return <BankTransferSuccess />;
    default:
      return null;
  }
};

const BankTransferFlowModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: selectIsBankTransferModalOpened(state),
    state: selectBankTransferFlowState(state),
  }),
  dispatchToProps: d => ({
    onCancel: () => d(actions.bankTransferFlow.stopBankTransfer()),
  }),
})(BankTransferFlowModalLayout);

export { BankTransferFlowModal, BankTransferFlowModalLayout };
