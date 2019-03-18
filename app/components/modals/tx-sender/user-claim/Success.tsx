import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { selectMonitoredTxAdditionalData } from "../../../../modules/tx/monitor/selectors";
import { TClaimAdditionalData } from "../../../../modules/tx/transactions/claim/types";
import { ETxSenderType } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { ConfettiEthereum } from "../../../shared/ethererum";
import { Message } from "../../Message";
import { ClaimTransactionDetails } from "./ClaimTransactionDetails";

interface IExternalProps {
  txTimestamp: number;
}

interface IDispatchProps {
  goToPortfolio: () => void;
}

interface IStateProps {
  additionalData: TClaimAdditionalData;
}

type IProps = IDispatchProps & IStateProps & IExternalProps;

export const UserClaimSuccessComponent: React.FunctionComponent<IProps> = ({
  txTimestamp,
  goToPortfolio,
  additionalData,
}) => (
  <Message
    data-test-id="modals.tx-sender.withdraw-flow.success"
    image={<ConfettiEthereum className="mb-3" />}
    title={<FormattedMessage id="withdraw-flow.success" />}
    titleClassName="text-success"
    text={
      <FormattedMessage
        id="user-claim-flow.success.congrats"
        values={{ token: additionalData.tokenName }}
      />
    }
  >
    <ClaimTransactionDetails
      additionalData={additionalData}
      className="mb-4"
      txTimestamp={txTimestamp}
    />

    <Button onClick={goToPortfolio} layout={EButtonLayout.SECONDARY}>
      <FormattedMessage id="menu.portfolio.view" />
    </Button>
  </Message>
);

export const UserClaimSuccess = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    additionalData: selectMonitoredTxAdditionalData<ETxSenderType.USER_CLAIM>(state)!,
  }),
  dispatchToProps: dispatch => ({
    goToPortfolio: () => dispatch(actions.routing.goToPortfolio()),
  }),
})(UserClaimSuccessComponent);
