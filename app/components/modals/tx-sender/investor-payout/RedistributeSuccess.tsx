import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { ButtonArrowRight } from "../../../shared/buttons";
import { Message } from "../../Message";

import * as redistributeIcon from "../../../../assets/img/redistribute.svg";

interface IDispatchProps {
  goToPortfolio: () => void;
}

type IProps = IDispatchProps;

const InvestorRedistributePayoutSuccessLayout: React.FunctionComponent<IProps> = ({
  goToPortfolio,
}) => (
  <Message
    data-test-id="investor-payout.redistribute-success"
    image={<img src={redistributeIcon} alt="" className="mb-3" />}
    text={<FormattedMessage id="investor-payout.redistribute.success.text" />}
  >
    <ButtonArrowRight onClick={goToPortfolio}>
      <FormattedMessage id="menu.portfolio.view" />
    </ButtonArrowRight>
  </Message>
);

const InvestorRedistributePayoutSuccess = appConnect<{}, IDispatchProps>({
  dispatchToProps: dispatch => ({
    goToPortfolio: () => dispatch(actions.routing.goToPortfolio()),
  }),
})(InvestorRedistributePayoutSuccessLayout);

export { InvestorRedistributePayoutSuccess, InvestorRedistributePayoutSuccessLayout };
