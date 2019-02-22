import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { ButtonArrowRight } from "../../../shared/buttons";
import { ConfettiEthereum } from "../../../shared/ethererum";
import { Message } from "../../Message";

interface IDispatchProps {
  goToWallet: () => void;
}

type IProps = IDispatchProps;

const InvestorAcceptPayoutSuccessLayout: React.FunctionComponent<IProps> = ({ goToWallet }) => (
  <Message
    data-test-id="investor-payout.accept-success"
    image={<ConfettiEthereum className="mb-3" />}
    text={<FormattedMessage id="investor-payout.accept.success.text" />}
  >
    <ButtonArrowRight onClick={goToWallet}>
      <FormattedMessage id="menu.wallet.view" />
    </ButtonArrowRight>
  </Message>
);

const InvestorAcceptPayoutSuccess = appConnect<{}, IDispatchProps>({
  dispatchToProps: dispatch => ({
    goToWallet: () => dispatch(actions.routing.goToWallet()),
  }),
})(InvestorAcceptPayoutSuccessLayout);

export { InvestorAcceptPayoutSuccess, InvestorAcceptPayoutSuccessLayout };
