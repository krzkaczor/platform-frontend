import * as React from "react";

import { ButtonClose } from "../shared/buttons";
import { Panel } from "../shared/Panel";

import * as styles from "./ModalComponentBody.module.scss";

export interface IModalComponentProps {
  onClose?: () => void;
}

export const ModalComponentBody: React.FunctionComponent<IModalComponentProps> = ({
  children,
  onClose,
  ...props
}) => (
  <Panel className={styles.modal} {...props}>
    <div className={styles.header}>
      {onClose && <ButtonClose data-test-id="modal-close-button" onClick={onClose} />}
    </div>
    <div className={styles.body}>{children}</div>
  </Panel>
);
