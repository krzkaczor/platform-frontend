import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import {
  EETOStateOnChain,
  TBlEtoWithCompanyAndContract,
} from "../../../../modules/public-etos/interfaces/interfaces";
import { selectEtoOnChainStateById } from "../../../../modules/public-etos/selectors";
import { selectEtherPriceEur } from "../../../../modules/shared/tokenPrice/selectors";
import { appConnect } from "../../../../store";
import { divideBigNumbers } from "../../../../utils/BigNumberUtils";
import { ECurrency, EMoneyFormat, Money } from "../../../shared/Money";
import { CounterWidget } from "./CounterWidget";
import { InvestmentProgress } from "./InvestmentWidget/InvestmentProgress";
import { Message } from "./Message";

import * as styles from "./EtoMaxCapExceeded.module.scss";

export interface IExternalProps {
  eto: TBlEtoWithCompanyAndContract;
}

interface IStateProps {
  etherPriceEur: BigNumber;
  isPreEto: boolean;
}

interface IWithProps {
  isWaitingForNextStateToStart: boolean;
  nextStateStartDate: Date;
}

const EtoMaxCapExceededComponent: React.FunctionComponent<
  IExternalProps & IStateProps & IWithProps
> = ({ eto, etherPriceEur, isPreEto, isWaitingForNextStateToStart, nextStateStartDate }) => {
  return isPreEto && isWaitingForNextStateToStart ? (
    <div className={styles.maxCapExceeded}>
      <CounterWidget
        endDate={nextStateStartDate}
        state={EETOStateOnChain.Public}
        alternativeText={
          <FormattedMessage id="shared-component.eto-overview.pre-eto.max-cap-reached" />
        }
      />
    </div>
  ) : (
    <div className={styles.maxCapExceeded}>
      <div className={cn(styles.header, styles.center)}>
        <div>
          <Message title={<FormattedMessage id="shared-component.eto-overview.success" />} />
        </div>
      </div>
      <div className={styles.header}>
        <div>
          <Money
            value={divideBigNumbers(eto.contract!.totalInvestment.totalEquivEurUlps, etherPriceEur)}
            currency={ECurrency.ETH}
          />
        </div>
        <div>
          <FormattedMessage
            id="shared-component.eto-overview.investors"
            values={{ totalInvestors: eto.contract!.totalInvestment.totalInvestors.toNumber() }}
          />
        </div>
      </div>
      <div className={styles.header}>
        <div>
          <Money
            value={eto.contract!.totalInvestment.totalTokensInt.toNumber()}
            currency={ECurrency.EUR_TOKEN}
            format={EMoneyFormat.FLOAT}
          />
        </div>
        <div className={cn(styles.capReached, "text-uppercase")}>
          <FormattedMessage id="shared-component.eto-overview.max-cap-reached" />
        </div>
      </div>
      <InvestmentProgress eto={eto} />
    </div>
  );
};

const EtoMaxCapExceededWidget = compose<IExternalProps & IStateProps & IWithProps, IExternalProps>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: (state, props) => ({
      etherPriceEur: selectEtherPriceEur(state),
      isPreEto: selectEtoOnChainStateById(state, props.eto.etoId) === EETOStateOnChain.Whitelist,
    }),
  }),
  withProps<IWithProps, IStateProps & IExternalProps>(({ eto }) => {
    const publicStartDate = eto.contract!.startOfStates[EETOStateOnChain.Public];

    return {
      isWaitingForNextStateToStart: !!publicStartDate && publicStartDate > new Date(),
      nextStateStartDate: publicStartDate!,
    };
  }),
)(EtoMaxCapExceededComponent);

export { EtoMaxCapExceededWidget, EtoMaxCapExceededComponent };
