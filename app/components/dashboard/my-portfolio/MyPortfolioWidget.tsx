import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../modules/actions";
import {
  selectIsIncomingPayoutAvailable,
  selectIsIncomingPayoutLoading,
} from "../../../modules/investor-portfolio/selectors";
import { selectNeuBalance, selectNeuBalanceEuroAmount } from "../../../modules/wallet/selectors";
import { appConnect } from "../../../store";
import { CommonHtmlProps } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { Panel } from "../../shared/Panel";
import { WarningAlert } from "../../shared/WarningAlert";
import { IncomingPayoutWidget } from "../incoming-payout/IncomingPayoutWidget";
import { MyNeuWidget } from "./MyNeuWidget";

import BigNumber from "bignumber.js";
import * as styles from "./MyPortfolioWidget.module.scss";

type TOwnProps = CommonHtmlProps;

interface IBodyProps {
  error?: string;
  balanceNeu: BigNumber;
  balanceEur: BigNumber;
  isIncomingPayoutAvailable: boolean;
}

interface IStateProps {
  isLoading: boolean;
  balanceNeu?: BigNumber;
  balanceEur?: BigNumber;
  error?: string;
  isIncomingPayoutLoading: boolean;
  isIncomingPayoutAvailable: boolean;
}

type IProps = TOwnProps & IStateProps;

const Welcome: React.FunctionComponent<{}> = () => (
  <div className={styles.main}>
    <h3 className={styles.welcome}>
      <FormattedMessage id="dashboard.my-portfolio-widget.welcome" />
    </h3>
    <p>
      <FormattedMessage id="dashboard.my-portfolio-widget.explanation" />
    </p>
  </div>
);

export const MyPortfolioWidgetComponentBody: React.FunctionComponent<IBodyProps> = ({
  error,
  balanceEur,
  balanceNeu,
  isIncomingPayoutAvailable,
}) => {
  if (error) {
    return <WarningAlert>{error}</WarningAlert>;
  }

  return (
    <div className={styles.contentWrapper}>
      {isIncomingPayoutAvailable ? <IncomingPayoutWidget /> : <Welcome />}
      <MyNeuWidget balanceNeu={balanceNeu} balanceEur={balanceEur} />
    </div>
  );
};

export const MyPortfolioWidgetComponent: React.FunctionComponent<IProps> = ({
  className,
  style,
  isLoading,
  error,
  balanceEur,
  balanceNeu,
  isIncomingPayoutAvailable,
}) => {
  return (
    <Panel className={className} style={style}>
      <>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <MyPortfolioWidgetComponentBody
            {...{
              balanceEur: balanceEur!,
              balanceNeu: balanceNeu!,
            }}
            error={error}
            isIncomingPayoutAvailable={isIncomingPayoutAvailable}
            test-data-id="dashboard-my-portfolio-widget"
          />
        )}
      </>
    </Panel>
  );
};

export const LoadingComponent: React.FunctionComponent<IProps> = ({ className, style }) => (
  <Panel className={className} style={style}>
    <LoadingIndicator />
  </Panel>
);

export const MyPortfolioWidget = compose<IStateProps, TOwnProps>(
  onEnterAction({
    actionCreator: d => {
      d(actions.investorEtoTicket.getIncomingPayouts());
    },
  }),
  appConnect<IStateProps, {}, TOwnProps>({
    stateToProps: s => ({
      isLoading: s.wallet.loading,
      error: s.wallet.error,
      balanceNeu: selectNeuBalance(s.wallet),
      balanceEur: selectNeuBalanceEuroAmount(s),
      isIncomingPayoutLoading: selectIsIncomingPayoutLoading(s),
      isIncomingPayoutAvailable: selectIsIncomingPayoutAvailable(s),
    }),
  }),
  branch((props: IStateProps) => props.isLoading, renderComponent(LoadingComponent)),
)(MyPortfolioWidgetComponent);
