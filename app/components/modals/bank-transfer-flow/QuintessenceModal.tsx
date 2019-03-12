import * as React from "react";

import { ModalComponentBody } from "../ModalComponentBody";

import * as quintessenceIcon from "../../../assets/img/bank-transfer/quintessence.png";
import * as styles from "./QuintessenceModal.module.scss";

type TProps = {
  isOpen: boolean;
  onClose: () => void;
};

const QuintessenceModal: React.FunctionComponent<TProps> = ({ isOpen, onClose, children }) => (
  <ModalComponentBody isOpen={isOpen} onClose={onClose}>
    {children}
    <img className={styles.logo} src={quintessenceIcon} alt="" />
  </ModalComponentBody>
);

export { QuintessenceModal };
