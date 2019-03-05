import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { appRoutes } from "../../../appRoutes";
import { ButtonArrowRight } from "../../../shared/buttons";
import { ConfettiEthereum } from "../../../shared/ethererum";
import { EtherscanTxLink } from "../../../shared/links";
import { Message } from "../../Message";

interface IDispatchProps {
  goToPortfolio: () => void;
  txHash: string;
}

const InvestmentSuccessComponent: React.FunctionComponent<IDispatchProps> = ({
  goToPortfolio,
  txHash,
}) => (
  <Message
    data-test-id="investment-flow.success.title"
    image={<ConfettiEthereum className="mb-3" />}
    title={<FormattedMessage id="investment-flow.success.title" />}
    text={
      <FormattedMessage
        id="investment-flow.success.congratulation-text"
        values={{ etherscan: <EtherscanTxLink txHash={txHash} /> }}
      />
    }
  >
    <ButtonArrowRight
      data-test-id="investment-flow.success.view-your-portfolio"
      onClick={goToPortfolio}
    >
      <FormattedMessage id="investment-flow.success.view-portfolio" />
    </ButtonArrowRight>
  </Message>
);

const InvestmentSuccess = appConnect({
  dispatchToProps: dispatch => ({
    goToPortfolio: () => {
      dispatch(actions.routing.goTo(appRoutes.portfolio));
      dispatch(actions.txSender.txSenderHideModal());
    },
  }),
})(InvestmentSuccessComponent);

export { InvestmentSuccess, InvestmentSuccessComponent };
