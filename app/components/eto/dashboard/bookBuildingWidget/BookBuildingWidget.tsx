import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { actions } from "../../../../modules/actions";
import { IBlBookBuildingStats } from "../../../../modules/bookbuilding-flow/interfaces/BookbuildingStats";
import { selectBookbuildingStats } from "../../../../modules/bookbuilding-flow/selectors";
import {
  selectCanEnableBookBuilding,
  selectEtoId,
  selectIsBookBuilding,
  selectMaxPledges,
} from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { TTranslatedString } from "../../../../types";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { onLeaveAction } from "../../../../utils/OnLeaveAction";
import { ButtonArrowRight } from "../../../shared/buttons";
import { Document } from "../../../shared/Document";
import { DocumentTemplateButton } from "../../../shared/DocumentLink";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryPanel } from "../../../shared/errorBoundary/ErrorBoundaryPanel";
import { LoadingIndicator } from "../../../shared/loading-indicator";
import { ECurrency, ECurrencySymbol, EMoneyFormat, Money } from "../../../shared/Money";
import { Panel } from "../../../shared/Panel";

import BigNumber from "bignumber.js";
import * as styles from "../../EtoContentWidget.module.scss";

interface IDispatchProps {
  startBookBuilding: (etoId: string) => void;
  stopBookBuilding: (etoId: string) => void;
  downloadCSV: () => void;
}

interface IStateProps {
  bookBuildingEnabled?: boolean;
  bookBuildingStats: IBlBookBuildingStats;
  maxPledges: BigNumber | null;
  etoId?: string;
  canEnableBookbuilding: boolean;
}

interface IBookBuilding {
  bookBuildingStats: IBlBookBuildingStats;
  downloadCSV: () => void;
  maxPledges: BigNumber | null;
}

interface ILayoutProps {
  onClick: (etoId: string) => void;
  headerText: TTranslatedString;
  text: TTranslatedString;
  buttonText: TTranslatedString;
  canEnableBookbuilding: boolean;
}

type IProps = IDispatchProps & IStateProps;

const BookBuildingStats = ({ bookBuildingStats, maxPledges, downloadCSV }: IBookBuilding) => (
  <>
    <div className={styles.groupWrapper}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.amount-backed" />
      </span>
      <span className={styles.value}>
        <Money
          value={bookBuildingStats.pledgedAmount}
          currency={ECurrency.EUR}
          format={EMoneyFormat.FLOAT}
          currencySymbol={ECurrencySymbol.SYMBOL}
        />
      </span>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview.investors-backed" />
      </span>
      <span className={styles.value} data-test-id="eto-bookbuilding-investors-backed">
        {maxPledges !== null ? (
          <FormattedMessage
            id="settings.book-building-stats-widget.number-of-pledges"
            values={{
              pledges: bookBuildingStats.investorsCount.toNumber(),
              maxPledges: maxPledges.toNumber(),
            }}
          />
        ) : null}
      </span>
    </div>
    {bookBuildingStats.investorsCount.gt(0) ? (
      <DocumentTemplateButton
        onClick={downloadCSV}
        title={<FormattedMessage id="eto-bookbuilding-widget.download-bookbuilding-stats" />}
        altIcon={<Document extension="csv" />}
      />
    ) : null}
  </>
);

const BookBuildingWidgetLayout: React.FunctionComponent<ILayoutProps> = ({
  children,
  onClick,
  headerText,
  text,
  buttonText,
  canEnableBookbuilding,
}) => (
  <Panel headerText={headerText}>
    <div className={styles.content}>
      <p className={cn(styles.text)}>
        {canEnableBookbuilding ? (
          text
        ) : (
          <FormattedMessage id="eto-bookbuilding-widget.button-disabled" />
        )}
      </p>
      {children}

      {canEnableBookbuilding && (
        <div className={styles.widgetButton}>
          <ButtonArrowRight
            onClick={onClick}
            data-test-id="eto-flow-start-bookbuilding"
            innerClassName={styles.buttonOverride}
          >
            {buttonText}
          </ButtonArrowRight>
        </div>
      )}
    </div>
  </Panel>
);

export const BookBuildingWidgetComponent: React.FunctionComponent<IProps> = ({
  startBookBuilding,
  bookBuildingEnabled,
  maxPledges,
  stopBookBuilding,
  bookBuildingStats,
  downloadCSV,
  etoId,
  canEnableBookbuilding,
}) => {
  if (bookBuildingStats === undefined) {
    //TODO data loading state
    return <LoadingIndicator className={styles.loading} />;
  } else if (!bookBuildingEnabled && bookBuildingStats.investorsCount.isZero()) {
    return (
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.start-book-building" />}
        text={<FormattedMessage id="settings.book-building-widget.proposal-accepted" />}
        buttonText={<FormattedMessage id="settings.book-building-widget.start-book-building" />}
        onClick={() => startBookBuilding(etoId as string)}
        canEnableBookbuilding={canEnableBookbuilding}
      />
    );
  } else if (!bookBuildingEnabled && bookBuildingStats.investorsCount) {
    return (
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.book-building-disabled" />}
        text={<FormattedMessage id="settings.book-building-widget.book-building-disabled-text" />}
        buttonText={
          <FormattedMessage id="settings.book-building-widget.reactivate-book-building" />
        }
        onClick={() => startBookBuilding(etoId as string)}
        canEnableBookbuilding={canEnableBookbuilding}
      >
        <BookBuildingStats
          bookBuildingStats={bookBuildingStats}
          downloadCSV={downloadCSV}
          maxPledges={maxPledges}
        />
      </BookBuildingWidgetLayout>
    );
  } else {
    return (
      <BookBuildingWidgetLayout
        headerText={<FormattedMessage id="settings.book-building-widget.book-building-enabled" />}
        text={<FormattedMessage id="settings.book-building-widget.book-building-enabled-text" />}
        buttonText={<FormattedMessage id="settings.book-building-widget.stop-book-building" />}
        onClick={() => stopBookBuilding(etoId as string)}
        canEnableBookbuilding={canEnableBookbuilding}
      >
        <BookBuildingStats
          bookBuildingStats={bookBuildingStats}
          downloadCSV={downloadCSV}
          maxPledges={maxPledges}
        />
      </BookBuildingWidgetLayout>
    );
  }
};

export const BookBuildingWidget = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      bookBuildingEnabled: selectIsBookBuilding(state),
      bookBuildingStats: selectBookbuildingStats(state, selectEtoId(state) as string),
      maxPledges: selectMaxPledges(state),
      etoId: selectEtoId(state),
      canEnableBookbuilding: selectCanEnableBookBuilding(state),
    }),
    dispatchToProps: dispatch => ({
      startBookBuilding: etoId => {
        dispatch(actions.etoFlow.changeBookBuildingStatus(true));
        dispatch(actions.bookBuilding.bookBuildingStartWatch(etoId));
      },
      stopBookBuilding: etoId => {
        dispatch(actions.etoFlow.changeBookBuildingStatus(false));
        dispatch(actions.bookBuilding.bookBuildingStopWatch(etoId));
      },
      downloadCSV: () => {
        dispatch(actions.etoFlow.downloadBookBuildingStats());
      },
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      if (props.bookBuildingEnabled) {
        dispatch(actions.bookBuilding.bookBuildingStartWatch(props.etoId));
      } else {
        dispatch(actions.bookBuilding.loadBookBuildingStats(props.etoId));
      }
    },
  }),
  onLeaveAction({
    actionCreator: (dispatch, props) => {
      if (props.bookBuildingEnabled) {
        dispatch(actions.bookBuilding.bookBuildingStopWatch(props.etoId));
      }
    },
  }),
)(BookBuildingWidgetComponent);
