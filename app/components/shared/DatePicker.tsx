import * as moment from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { IS_CYPRESS, IS_DEV } from "../../config/constants";
import { DatetimeProps, TypedDatetime } from "./forms";
import { InlineIcon } from "./icons";
import { TimeLeft } from "./TimeLeft";
import { utcTime } from "./utils";

import * as iconCalendar from "../../assets/img/inline_icons/calendar.svg";
import * as styles from "./forms/fields/FormFieldDatePicker.module.scss";

interface IDatePickerProps {
  isValidDate?: (currentDate: moment.Moment) => boolean;
  onTestInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DatePicker: React.ComponentType<DatetimeProps & IDatePickerProps> = ({
  dataTestId,
  value,
  onChange,
  isValidDate,
  onTestInputChange,
}) => {
  return (
    <TypedDatetime
      closeOnSelect={true}
      utc={true}
      dateFormat={"L"}
      timeFormat={"HH:mm z"}
      open={false}
      value={value}
      onChange={onChange}
      isValidDate={isValidDate}
      renderInput={(props, openCalendar) => {
        return (
          <>
            {IS_CYPRESS || IS_DEV ? (
              <input //hidden input for e2e tests
                data-test-id={dataTestId}
                autoComplete="off"
                type="text"
                style={{ display: "none" }}
                onChange={
                  onTestInputChange &&
                  ((e: React.ChangeEvent<HTMLInputElement>) => onTestInputChange(e))
                }
              />
            ) : null}

            <div className={styles.formFieldDatePicker} onClick={openCalendar}>
              <div className={styles.icon}>
                <InlineIcon svgIcon={iconCalendar} />
              </div>
              <div className={styles.chosenDate}>
                <span>{utcTime(props.value)}</span>
                <span>
                  <FormattedMessage id="eto.settings.set-eto-start-date-time-left" />
                  {`: `}
                  <TimeLeft key={props.value} refresh={true} finalTime={props.value} asUtc={true} />
                </span>
              </div>
            </div>
          </>
        );
      }}
    />
  );
};

export { DatePicker };
