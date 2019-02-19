import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { ButtonArrowRight } from "../../shared/buttons";
import { Confetti, EConfettiTheme } from "../../shared/Confetti";
import { Message } from "../Message";

import * as bankIcon from "../../../assets/img/bank-transfer/bank.svg";

interface IDispatchProps {
  goToWallet: () => void;
}

type IProps = IDispatchProps;

const BankTransferSuccessLayout: React.FunctionComponent<IProps> = ({ goToWallet }) => (
  <Message
    image={
      <Confetti theme={EConfettiTheme.PURPLE} className="mb-3">
        <img src={bankIcon} alt="" />
      </Confetti>
    }
    text={<FormattedMessage id="bank-transfer.success.text" />}
  >
    <ButtonArrowRight onClick={goToWallet}>
      <FormattedMessage id="menu.wallet.view" />
    </ButtonArrowRight>
  </Message>
);

const BankTransferSuccess = appConnect<{}, IDispatchProps>({
  dispatchToProps: dispatch => ({
    goToWallet: () => dispatch(actions.routing.goToWallet()),
  }),
})(BankTransferSuccessLayout);

export { BankTransferSuccess, BankTransferSuccessLayout };
