import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as moment from "moment";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { FormGroup } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../../modules/actions";
import { selectPlatformTermsConstants } from "../../../../modules/contracts/selectors";
import { selectPreEtoStartDateFromContract } from "../../../../modules/eto-flow/selectors";
import { isValidEtoStartDate } from "../../../../modules/eto-flow/utils";
import { appConnect } from "../../../../store";
import { ButtonArrowRight } from "../../../shared/buttons";
import { DatePicker } from "../../../shared/DatePicker";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryPanel } from "../../../shared/errorBoundary/ErrorBoundaryPanel";
import { FormError } from "../../../shared/forms";
import { Panel } from "../../../shared/Panel";
import { FancyTimeLeft, TimeLeft } from "../../../shared/TimeLeft";
import { localTime, timeZone, utcTime, weekdayLocal, weekdayUTC } from "../../../shared/utils";

import * as styles from "../../EtoContentWidget.module.scss";

interface IStateProps {
  etoDate?: Date;
  minOffsetPeriod: BigNumber;
}

interface IExternalProps {
  layoutClass?: string;
}

interface IDispatchProps {
  uploadDate: (time: moment.Moment) => void;
}

interface IDateChooserProps {
  etoDate?: Date;
  minOffsetPeriod: BigNumber;
  uploadDate: (time: moment.Moment) => void;
}

interface IDateChooserState {
  isOpen: boolean;
  newEtoDate: moment.Moment;
}

interface IChangeDateCountdown {
  etoDate?: Date;
  minOffsetPeriodInMinutes: number;
}

interface IDateChooserOpenProps {
  etoDate?: Date;
  newEtoDate: moment.Moment | null;
  setNewEtoDate: (newEtoDate: moment.Moment | string) => void;
  newDateIsValid: (date: moment.Moment | null) => boolean;
  onTestInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minOffsetPeriodInMinutes: number;
  uploadDate: (time: moment.Moment) => void;
  closeDatePicker: () => void;
}

interface IDateChooserClosedProps {
  etoDate?: Date;
  minOffsetPeriodInMinutes: number;
  openDatePicker: () => void;
}

const ChangeDateCountdown: React.ComponentType<IChangeDateCountdown> = ({
  etoDate,
  minOffsetPeriodInMinutes,
}) => {
  if (etoDate) {
    return (
      <div className={cn(styles.text)}>
        <FormattedMessage id="eto.status.onchain.change-eto-date-countdown-text" />{" "}
        <TimeLeft
          finalTime={moment(etoDate).subtract(minOffsetPeriodInMinutes, "minutes")}
          asUtc={true}
          refresh={true}
        />
      </div>
    );
  } else {
    return null;
  }
};

const DateChooserOpen = ({
  etoDate,
  newEtoDate,
  setNewEtoDate,
  newDateIsValid,
  onTestInputChange,
  minOffsetPeriodInMinutes,
  uploadDate,
  closeDatePicker,
}: IDateChooserOpenProps) => {
  const newDateIsSet = newEtoDate !== null;
  return (
    <>
      <FormGroup className="justify-content-center mb-0">
        <DatePicker
          value={newEtoDate || etoDate}
          onChange={setNewEtoDate}
          onTestInputChange={onTestInputChange}
          dataTestId="eto-settings-start-date-input"
          isValidDate={(currentDate: moment.Moment) =>
            currentDate.isAfter(moment.utc().add(minOffsetPeriodInMinutes, "minutes"))
          }
        />
        {newDateIsSet &&
          !newDateIsValid(newEtoDate) && (
            <FormError
              name="etoStartDate"
              message={
                <FormattedMessage
                  id="eto.settings.error-message.eto-start-date-too-early"
                  values={{ days: minOffsetPeriodInMinutes / 60 / 24 }}
                />
              }
            />
          )}
      </FormGroup>
      <div className={styles.widgetButton}>
        <ButtonArrowRight
          onClick={closeDatePicker}
          data-test-id="eto-settings-start-date-cancel"
          innerClassName={styles.buttonOverride}
        >
          <FormattedMessage id="eto.settings.cancel-change-eto-start-date" />
        </ButtonArrowRight>
        <ButtonArrowRight
          onClick={uploadDate}
          disabled={!newDateIsValid(newEtoDate)}
          data-test-id="eto-settings-start-date-confirm"
          innerClassName={styles.buttonOverride}
        >
          <FormattedMessage id="eto.settings.confirm-change-eto-start-date" />
        </ButtonArrowRight>
      </div>
    </>
  );
};

const DateChooserClosed = ({
  etoDate,
  minOffsetPeriodInMinutes,
  openDatePicker,
}: IDateChooserClosedProps) => (
  <>
    <ChangeDateCountdown etoDate={etoDate} minOffsetPeriodInMinutes={minOffsetPeriodInMinutes} />
    <div className={styles.widgetButton}>
      <ButtonArrowRight
        onClick={openDatePicker}
        data-test-id="eto-settings-start-date-open-date-picker"
        innerClassName={styles.buttonOverride}
      >
        {etoDate ? (
          <FormattedMessage id="eto.settings.change-eto-start-date" />
        ) : (
          <FormattedMessage id="eto.settings.set-eto-start-date" />
        )}
      </ButtonArrowRight>
    </div>
  </>
);

class DateChooser extends React.PureComponent<IDateChooserProps, IDateChooserState> {
  minOffsetPeriodInMinutes = Math.floor(this.props.minOffsetPeriod.div(60).toNumber());
  // dates get rounded down. Add 3 minutes so that it shows "in 14 days" instead of "in 13 days 23 hours"
  defaultOffsetInMinutes = this.minOffsetPeriodInMinutes * 2 + 3;

  state = {
    isOpen: false,

    newEtoDate:
      moment.utc(this.props.etoDate) ||
      moment()
        .utc()
        .add(this.defaultOffsetInMinutes, "minutes"),
  };

  closeDatePicker = () => {
    this.setState({
      isOpen: false,
    });
  };

  openDatePicker = () => {
    this.setState({
      isOpen: true,
    });
  };

  newDateIsValid = (date: moment.Moment | null) =>
    date === null
      ? false
      : moment.isMoment(date) && isValidEtoStartDate(date.toDate(), this.props.minOffsetPeriod);

  //this is only necessary to validate hidden input for e2e tests
  isMomentOrValidString = (newEtoDate: string | moment.Moment) =>
    newEtoDate &&
    (moment.isMoment(newEtoDate) || moment(newEtoDate).format("MM/DD/YYYY HH:mm") === newEtoDate);

  //this is only necessary to validate hidden input for e2e tests
  onTestInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && this.isMomentOrValidString(e.target.value)) {
      this.setNewEtoDate(moment.utc(e.target.value));
    }
  };

  setNewEtoDate = (newEtoDate: moment.Moment | string) =>
    this.setState({
      newEtoDate: moment.utc(newEtoDate),
    });

  uploadDate = () => {
    if (this.state.newEtoDate !== null) {
      this.props.uploadDate(this.state.newEtoDate);
      this.setState({
        isOpen: false,
      });
    }
  };

  render(): React.ReactNode {
    const { etoDate } = this.props;
    const canChangeDate =
      !etoDate ||
      this.props.minOffsetPeriod.lessThanOrEqualTo(
        moment.utc(etoDate).diff(moment().utc(), "seconds"),
      );
    {
      if (!canChangeDate) {
        return (
          <p className={cn(styles.text)}>
            <FormattedMessage id="eto.settings.changing-eto-start-date-not-possible" />
          </p>
        );
      } else if (canChangeDate && this.state.isOpen) {
        return (
          <DateChooserOpen
            etoDate={etoDate}
            newEtoDate={this.state.newEtoDate}
            setNewEtoDate={this.setNewEtoDate}
            onTestInputChange={this.onTestInputChange}
            minOffsetPeriodInMinutes={this.minOffsetPeriodInMinutes}
            newDateIsValid={this.newDateIsValid}
            closeDatePicker={this.closeDatePicker}
            uploadDate={this.uploadDate}
          />
        );
      } else {
        return (
          <DateChooserClosed
            etoDate={etoDate}
            minOffsetPeriodInMinutes={this.minOffsetPeriodInMinutes}
            openDatePicker={this.openDatePicker}
          />
        );
      }
    }
  }
}

const ChooseEtoStartDateWidgetComponent: React.ComponentType<
  IStateProps & IDispatchProps & IExternalProps
> = props => {
  return (
    <Panel
      headerText={<FormattedMessage id="eto.settings.eto-start-date" />}
      className={props.layoutClass}
    >
      <div className={styles.content}>
        <p className={cn(styles.text, "pt-2")}>
          <FormattedMessage id="settings.choose-pre-eto-date.book-building-will-stop" />
        </p>
        {props.etoDate ? (
          <>
            <div className={styles.etoDateWrapper}>
              <span className={styles.etoTimeLeftStart}>
                <FormattedMessage id="eto.settings.set-eto-start-date-time-left" />:
              </span>
              <FancyTimeLeft finalTime={props.etoDate} asUtc={true} refresh={true} />
              <span className={styles.etoDate} data-test-id="eto-settings-display-start-date-utc">
                {`UTC: ${weekdayUTC(props.etoDate)}, ${utcTime(props.etoDate)}`}
              </span>
              <span className={styles.etoDate}>
                {`${timeZone()}: ${weekdayLocal(props.etoDate)}, ${localTime(props.etoDate)}`}
              </span>
            </div>
            <DateChooser {...props} />
          </>
        ) : (
          <>
            <FormattedHTMLMessage tagName="span" id="eto.settings.choose-eto-start-date" />
            <DateChooser {...props} />
          </>
        )}
      </div>
    </Panel>
  );
};

const ChooseEtoStartDateWidget = compose<React.FunctionComponent<IExternalProps>>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const constants = selectPlatformTermsConstants(state);
      return {
        etoDate: selectPreEtoStartDateFromContract(state), //new Date('Friday, 25 January 2019 18:13:00 GMT+00:00'),
        minOffsetPeriod: constants.DATE_TO_WHITELIST_MIN_DURATION,
      };
    },
    dispatchToProps: dispatch => ({
      uploadDate: (etoStartDate: moment.Moment) => {
        dispatch(actions.etoFlow.setNewStartDate(moment.utc(etoStartDate).toDate()));
        dispatch(actions.etoFlow.uploadStartDate());
      },
    }),
  }),
)(ChooseEtoStartDateWidgetComponent);

export { ChooseEtoStartDateWidgetComponent, ChooseEtoStartDateWidget };
