import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { ButtonArrowRight, EButtonLayout } from "../../../shared/buttons/Button";
import { EtherscanTxLink } from "../../../shared/links/EtherscanLink";
import { Message } from "../../Message";

import * as neurEurTransfer from "../../../../assets/img/bank-transfer/neur-eur.svg";
import * as styles from "./BankTransferRedeemSuccess.module.scss";

interface IExternalProps {
  txHash: string;
}

interface IDispatchProps {
  goToWallet: () => void;
}

type IComponentProps = IExternalProps & IDispatchProps;

const BankTransferRedeemSuccessComponent: React.FunctionComponent<IComponentProps> = ({
  txHash,
  goToWallet,
}) => (
  <Message
    image={<img className={styles.image} src={neurEurTransfer} />}
    title={<FormattedMessage id="bank-transfer.redeem.success.congratulations" />}
    text={<FormattedMessage id="bank-transfer.redeem.success.explanation" />}
  >
    <p className={styles.txHash}>
      Tx Hash: <EtherscanTxLink txHash={txHash}>{txHash}</EtherscanTxLink>
    </p>
    <ButtonArrowRight className="mt-4" onClick={goToWallet} layout={EButtonLayout.SECONDARY}>
      <FormattedMessage id="bank-transfer.redeem.success.go-to-wallet" />
    </ButtonArrowRight>
  </Message>
);

const BankTransferRedeemSuccess = appConnect<{}, IDispatchProps>({
  dispatchToProps: dispatch => ({
    goToWallet: () => dispatch(actions.routing.goToWallet()),
  }),
})(BankTransferRedeemSuccessComponent);

export { BankTransferRedeemSuccess, BankTransferRedeemSuccessComponent };
