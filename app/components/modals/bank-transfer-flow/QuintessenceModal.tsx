import * as React from "react";
import { Modal } from "reactstrap";

import { ModalComponentBody } from "../ModalComponentBody";

import * as quintessenceIcon from "../../../assets/img/bank-transfer/quintessence.png";
import * as styles from "./QuintessenceModal.module.scss";

type TProps = {
  isOpen: boolean;
  onClose: () => void;
};

const QuintessenceModal: React.FunctionComponent<TProps> = ({ isOpen, onClose, children }) => (
  <Modal isOpen={isOpen} toggle={onClose}>
    <ModalComponentBody onClose={onClose}>{children}</ModalComponentBody>
    <img className={styles.logo} src={quintessenceIcon} alt="" />
  </Modal>
);

export { QuintessenceModal };
