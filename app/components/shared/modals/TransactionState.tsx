import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container, Row } from "reactstrap";

import { TTranslatedString } from "../../../types";
import { SpinningEthereum } from "../ethererum";

import * as revertedImg from "../../../assets/img/ether_fail.svg";
import * as styles from "./TransactionState.module.scss";

export type TransactionStateType = "pending" | "reverted" | "confirmed";

interface IProps {
  state: TransactionStateType;
  txHash?: string;
  blockNumber?: number;
  title?: TTranslatedString;
}

export const TransactionState: React.FunctionComponent<IProps> = props => {
  let animation: React.ReactNode;
  let heading: TTranslatedString = "";
  switch (props.state) {
    case "pending":
      animation = <SpinningEthereum />;
      heading = <FormattedMessage id="transaction-state.pending" />;
      break;
    case "reverted":
      animation = <img src={revertedImg} />;
      heading = <FormattedMessage id="transaction-state.reverted" />;
      break;
    case "confirmed":
      animation = <SpinningEthereum />;
      heading = <FormattedMessage id="transaction-state.confirmed" />;
      break;
  }

  return (
    <Container className={styles.container}>
      <Row>{animation}</Row>

      <Row>
        <h4>{props.title || heading}</h4>
      </Row>

      <Row>{props.children}</Row>
      {props.txHash && (
        <Row>
          <p className={styles.txhash}>TxHash: {props.txHash}</p>
        </Row>
      )}
      {props.blockNumber && (
        <Row>
          <p className={styles.blockNumber}>
            Block Number: <span>{props.blockNumber}</span>
          </p>
        </Row>
      )}
    </Container>
  );
};
