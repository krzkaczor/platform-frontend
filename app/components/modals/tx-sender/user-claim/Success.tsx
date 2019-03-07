import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { selectEtoTokenName } from "../../../../modules/public-etos/selectors";
import { selectTxAdditionalData } from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { ConfettiEthereum } from "../../../shared/ethererum";

import * as styles from "./Success.module.scss";

interface IDispatchProps {
  goToPortfolio: () => void;
}

interface IStateProps {
  tokenName?: string;
}

type IProps = IDispatchProps & IStateProps;

export const UserClaimSuccessComponent: React.FunctionComponent<IProps> = ({
  goToPortfolio,
  tokenName,
}) => (
  <div className="text-center" data-test-id="modals.tx-sender.withdraw-flow.success">
    <ConfettiEthereum className="mb-3" />
    <h3 className={styles.title}>
      <FormattedMessage id="withdraw-flow.success" />
    </h3>
    <div className={styles.explanation}>
      <FormattedMessage id="user-claim-flow.success.congrats" values={{ token: tokenName }} />
    </div>
    <div className="mt-4">
      <Button onClick={goToPortfolio} layout={EButtonLayout.SECONDARY}>
        <FormattedMessage id="menu.portfolio.view" />
      </Button>
    </div>
  </div>
);

export const UserClaimSuccess = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => {
    const etoId: string = selectTxAdditionalData(state);
    return {
      tokenName: selectEtoTokenName(state, etoId),
    };
  },
  dispatchToProps: dispatch => ({
    goToPortfolio: () => dispatch(actions.routing.goToPortfolio()),
  }),
})(UserClaimSuccessComponent);
