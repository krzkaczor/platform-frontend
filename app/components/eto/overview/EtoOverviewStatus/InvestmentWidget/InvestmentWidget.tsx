import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../../../../modules/actions";
import { selectIsInvestor } from "../../../../../modules/auth/selectors";
import { selectIsUserVerifiedOnBlockchain } from "../../../../../modules/kyc/selectors";
import { selectEtoOnChainNextStateStartDate } from "../../../../../modules/public-etos/selectors";
import { TBlEtoWithCompanyAndContract } from "../../../../../modules/public-etos/interfaces/interfaces";
import { appConnect } from "../../../../../store";
import { withParams } from "../../../../../utils/withParams";
import { appRoutes } from "../../../../appRoutes";
import { Button, ButtonLink } from "../../../../shared/buttons";
import { ECurrency, Money } from "../../../../shared/Money";
import { EtoWidgetContext } from "../../../EtoWidgetView";
import { EndTimeWidget } from "../EndTimeWidget";
import { InvestmentProgress } from "./InvestmentProgress";

import * as styles from "./InvestmentWidget.module.scss";

export interface IInvestmentWidgetProps {
  eto: TBlEtoWithCompanyAndContract;
}

export interface IInvestmentWidgetStateProps {
  isAllowedToInvest: boolean;
  isInvestor: boolean;
  nextStateDate: Date | undefined;
}

export interface IInvestmentWidgetDispatchProps {
  startInvestmentFlow: () => void;
}
export type TInvestWidgetProps = IInvestmentWidgetProps &
  IInvestmentWidgetStateProps &
  IInvestmentWidgetDispatchProps;

const InvestmentWidgetLayout: React.FunctionComponent<TInvestWidgetProps> = ({
  startInvestmentFlow,
  eto,
  isInvestor,
  isAllowedToInvest,
  nextStateDate,
}) => {
  const totalInvestors = eto.contract!.totalInvestment.totalInvestors.toNumber();

  return (
    <div className={styles.investmentWidget}>
      <div>
        <div className={styles.header}>
          <div>
            <Money
              value={eto.contract!.totalInvestment.etherTokenBalance}
              currency={ECurrency.ETH}
              className={styles.amount}
            />
            <Money
              value={eto.contract!.totalInvestment.euroTokenBalance}
              currency={ECurrency.EUR_TOKEN}
              className={styles.amount}
            />
          </div>
          {process.env.NF_MAY_SHOW_INVESTOR_STATS === "1" && (
            <div>
              <FormattedMessage
                id="shared-component.eto-overview.investors"
                values={{ totalInvestors }}
              />
            </div>
          )}
        </div>
        <InvestmentProgress eto={eto} />
      </div>
      <EtoWidgetContext.Consumer>
        {previewCode =>
          (isInvestor || previewCode) && (
            <div className={styles.investNowButton}>
              {previewCode ? (
                <ButtonLink
                  to={withParams(appRoutes.etoPublicView, { previewCode })}
                  target="_blank"
                  data-test-id="eto-widget-invest-now-button"
                >
                  <FormattedMessage id="shared-component.eto-overview.invest-now" />
                </ButtonLink>
              ) : isAllowedToInvest ? (
                <Button
                  onClick={startInvestmentFlow}
                  data-test-id={`eto-invest-now-button-${eto.etoId}`}
                >
                  <FormattedMessage id="shared-component.eto-overview.invest-now" />
                </Button>
              ) : (
                <ButtonLink
                  to={appRoutes.profile}
                  data-test-id="eto-overview-settings-update-required-to-invest"
                >
                  <FormattedMessage id="shared-component.eto-overview.settings-update-required" />
                </ButtonLink>
              )}
              <EndTimeWidget endTime={nextStateDate} />
            </div>
          )
        }
      </EtoWidgetContext.Consumer>
    </div>
  );
};

const InvestmentWidget = compose<TInvestWidgetProps, IInvestmentWidgetProps>(
  appConnect<IInvestmentWidgetStateProps, IInvestmentWidgetDispatchProps, IInvestmentWidgetProps>({
    stateToProps: (state, props) => ({
      isAllowedToInvest: selectIsUserVerifiedOnBlockchain(state),
      isInvestor: selectIsInvestor(state),
      nextStateDate: selectEtoOnChainNextStateStartDate(state, props.eto.previewCode),
    }),
    dispatchToProps: (dispatch, props) => ({
      startInvestmentFlow: () => dispatch(actions.investmentFlow.startInvestment(props.eto.etoId)),
    }),
  }),
)(InvestmentWidgetLayout);

export { InvestmentWidget };
