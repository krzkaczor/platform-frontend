import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Modal, Row } from "reactstrap";
import { compose, setDisplayName, withHandlers } from "recompose";

import { actions } from "../../modules/actions";
import { IBlGenericModalObject } from "../../modules/generic-modal/interfaces";
import {
  selectGenericModalComponent,
  selectGenericModalIsOpen,
  selectGenericModalObj,
} from "../../modules/generic-modal/selectors";
import { appConnect, AppDispatch } from "../../store";
import { DeepReadonly } from "../../types";
import { Button } from "../shared/buttons";
import { ModalComponentBody } from "./ModalComponentBody";

import * as successIcon from "../../assets/img/notifications/success.svg";
import * as warningIcon from "../../assets/img/notifications/warning.svg";
import { getMessageTranslation } from "../translatedMessages/messages";
import * as styles from "./GenericModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  genericModalObj?: DeepReadonly<IBlGenericModalObject>;
  component?: React.ComponentType<any>;
}

interface IHandlersProps {
  closeModal: () => void;
  onClick?: () => void;
}

interface IReduxProps {
  dispatch: AppDispatch;
}

export const genericModalIcons = {
  check: <img src={successIcon} className={styles.icon} aria-hidden="true" />,
  exclamation: <img src={warningIcon} className={styles.icon} aria-hidden="true" />,
};

const GenericModalLayout: React.FunctionComponent<IStateProps & IHandlersProps> = ({
  onClick,
  closeModal,
  isOpen,
  genericModalObj,
  component: Component,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={closeModal} centered>
      <ModalComponentBody onClose={closeModal}>
        {Component ? (
          <Component closeModal={closeModal} />
        ) : (
          <>
            <Row className="mt-5 justify-content-center">
              <h5 data-test-id="components.modals.generic-modal.title">
                {genericModalObj && getMessageTranslation(genericModalObj.title)}
              </h5>
            </Row>

            <Row className="mb-5 justify-content-center">
              <div className={styles.content}>
                {genericModalObj && genericModalObj.icon && genericModalIcons[genericModalObj.icon]}{" "}
                {genericModalObj &&
                  genericModalObj.description &&
                  getMessageTranslation(genericModalObj.description)}
              </div>
            </Row>

            <Row className="mb-5 justify-content-center">
              <Button onClick={onClick} data-test-id="generic-modal-dismiss-button">
                {genericModalObj && genericModalObj.actionLinkText ? (
                  getMessageTranslation(genericModalObj.actionLinkText)
                ) : (
                  <FormattedMessage id="modal.generic.button.dismiss" />
                )}
              </Button>
            </Row>
          </>
        )}
      </ModalComponentBody>
    </Modal>
  );
};

const GenericModal = compose<IStateProps & IHandlersProps, {}>(
  setDisplayName("GenericModal"),
  appConnect<IStateProps>({
    stateToProps: state => ({
      isOpen: selectGenericModalIsOpen(state.genericModal),
      genericModalObj: selectGenericModalObj(state.genericModal),
      component: selectGenericModalComponent(state.genericModal),
    }),
  }),
  withHandlers<IStateProps & IReduxProps, IHandlersProps>({
    closeModal: ({ dispatch }) => () => dispatch(actions.genericModal.hideGenericModal()),
    onClick: ({ genericModalObj, dispatch }) => () => {
      dispatch(actions.genericModal.hideGenericModal());

      if (genericModalObj && genericModalObj.onClickAction) {
        dispatch(genericModalObj.onClickAction);
      }
    },
  }),
)(GenericModalLayout);

export { GenericModal, GenericModalLayout };
