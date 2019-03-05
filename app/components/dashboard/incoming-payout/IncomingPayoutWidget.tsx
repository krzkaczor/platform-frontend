import * as moment from "moment";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { externalRoutes } from "../../../config/externalRoutes";
import { actions } from "../../../modules/actions";
import {
  selectEtherTokenIncomingPayout,
  selectEuroTokenIncomingPayout,
  selectIsIncomingPayoutDone,
} from "../../../modules/investor-portfolio/selectors";
import { appConnect } from "../../../store";
import { CommonHtmlProps } from "../../../types";
import { appRoutes } from "../../appRoutes";
import { ButtonLink, EButtonLayout } from "../../shared/buttons";
import { Counter } from "../../shared/Counter";
import { ECurrency, ECurrencySymbol, ETheme, Money } from "../../shared/Money";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./IncomingPayoutWidget.module.scss";

interface IDispatchProps {
  incomingPayoutDone: () => void;
}

interface IIncomingPayoutData {
  etherTokenIncomingPayout: string;
  euroTokenIncomingPayout: string;
}

type IStateProps = IIncomingPayoutData & {
  isIncomingPayoutDone: boolean;
};

type IComponentProps = CommonHtmlProps & IDispatchProps & IStateProps;

//calculate the start of the next day
const endDate = moment()
  .utc()
  .add(1, "day")
  .startOf("day")
  .toDate();

const IncomingPayoutDone: React.FunctionComponent<IIncomingPayoutData> = ({
  etherTokenIncomingPayout,
  euroTokenIncomingPayout,
}) => (
  <>
    <h3 className={styles.header} data-test-id="incoming-payout-done">
      <FormattedMessage id="dashboard.incoming-payout-widget.incoming-payout-done" />
    </h3>
    <div>
      <Money
        className={styles.incomingValue}
        theme={ETheme.GREEN}
        value={euroTokenIncomingPayout}
        currencySymbol={ECurrencySymbol.CODE}
        currency={ECurrency.EUR_TOKEN}
      />
      <span className={styles.incomingValue}> & </span>
      <Money
        className={styles.incomingValue}
        theme={ETheme.GREEN}
        value={etherTokenIncomingPayout}
        currencySymbol={ECurrencySymbol.CODE}
        currency={ECurrency.ETH}
      />
    </div>
    <ButtonLink
      data-test-id="incoming-payout-go-to-portfolio"
      to={appRoutes.portfolio}
      layout={EButtonLayout.SECONDARY}
      iconPosition="icon-after"
      svgIcon={arrowRight}
    >
      <FormattedMessage id="dashboard.incoming-payout-widget.go-to-portfolio" />
    </ButtonLink>
  </>
);

const IncomingPayoutCounter: React.FunctionComponent<IIncomingPayoutData & IDispatchProps> = ({
  incomingPayoutDone,
  euroTokenIncomingPayout,
  etherTokenIncomingPayout,
}) => (
  <>
    <h3 className={styles.header}>
      <FormattedMessage id="dashboard.incoming-payout-widget.incoming-payout" />
    </h3>
    <Counter
      data-test-id="incoming-payout-counter"
      className={styles.counterWidget}
      endDate={endDate}
      onFinish={() => incomingPayoutDone()}
    />
    <div>
      <Money
        data-test-id="incoming-payout-euro-token"
        className={styles.incomingValue}
        theme={ETheme.GREEN}
        value={euroTokenIncomingPayout}
        currencySymbol={ECurrencySymbol.CODE}
        currency={ECurrency.EUR_TOKEN}
      />
      <span className={styles.incomingValue}> & </span>
      <Money
        data-test-id="incoming-payout-ether-token"
        className={styles.incomingValue}
        theme={ETheme.GREEN}
        value={etherTokenIncomingPayout}
        currencySymbol={ECurrencySymbol.CODE}
        currency={ECurrency.ETH}
      />
    </div>
    <p className={styles.statementText}>
      <FormattedMessage id="dashboard.incoming-payout-widget.wallet-statement" />
    </p>
    <p className={styles.statementText}>
      <FormattedHTMLMessage
        tagName="span"
        id="dashboard.incoming-payout-widget.read-more"
        values={{ href: externalRoutes.incomingPayoutBlogPost }}
      />
    </p>
  </>
);

export const IncomingPayoutComponent: React.FunctionComponent<IComponentProps> = ({
  etherTokenIncomingPayout,
  euroTokenIncomingPayout,
  incomingPayoutDone,
  isIncomingPayoutDone,
}) => (
  <div className={styles.main}>
    {isIncomingPayoutDone ? (
      <IncomingPayoutDone
        etherTokenIncomingPayout={etherTokenIncomingPayout}
        euroTokenIncomingPayout={euroTokenIncomingPayout}
      />
    ) : (
      <IncomingPayoutCounter
        etherTokenIncomingPayout={etherTokenIncomingPayout}
        euroTokenIncomingPayout={euroTokenIncomingPayout}
        incomingPayoutDone={incomingPayoutDone}
      />
    )}
  </div>
);

export const IncomingPayoutWidget = compose<IStateProps & IDispatchProps, CommonHtmlProps>(
  appConnect<IStateProps, IDispatchProps, CommonHtmlProps>({
    stateToProps: s => ({
      etherTokenIncomingPayout: selectEtherTokenIncomingPayout(s),
      euroTokenIncomingPayout: selectEuroTokenIncomingPayout(s),
      isIncomingPayoutDone: selectIsIncomingPayoutDone(s),
    }),
    dispatchToProps: dispatch => ({
      incomingPayoutDone: () => dispatch(actions.investorEtoTicket.setIncomingPayoutDone()),
    }),
  }),
)(IncomingPayoutComponent);
