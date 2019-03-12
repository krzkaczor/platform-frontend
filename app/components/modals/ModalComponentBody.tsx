import * as React from "react";
import { Modal } from "reactstrap";

import { CommonHtmlProps } from "../../types";
import { ButtonClose } from "../shared/buttons";
import { Panel } from "../shared/Panel";

import * as styles from "./ModalComponentBody.module.scss";

export interface IModalComponentProps {
  onClose?: () => void;
  isOpen: boolean;
}

export const ModalComponentBody: React.FunctionComponent<
  IModalComponentProps & CommonHtmlProps
> = ({ children, onClose, isOpen, className, ...props }) => (
  <Modal isOpen={isOpen} toggle={onClose} className={className} centered={true}>
    <Panel className={styles.modal} {...props}>
      <div className={styles.header}>
        {onClose && <ButtonClose data-test-id="modal-close-button" onClick={onClose} />}
      </div>
      <div className={styles.body}>{children}</div>
    </Panel>
  </Modal>
);
