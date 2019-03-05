import * as moment from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EETOStateOnChain } from "../../../../modules/public-etos/types";
import { TTranslatedString } from "../../../../types";
import { Counter } from "../../../shared/Counter";
import { statusToName } from "../../../shared/ETOState";

import * as styles from "./CounterWidget.module.scss";

export interface ICounterWidgetProps {
  endDate: Date;
  state: EETOStateOnChain;
  alternativeText?: TTranslatedString;
}

const CounterWidget: React.FunctionComponent<ICounterWidgetProps> = ({
  endDate,
  state,
  alternativeText,
}) => {
  return (
    <div className={styles.counterWidget} data-test-id="eto-whitelist-count-down">
      <div className={styles.title}>
        {alternativeText ? (
          alternativeText
        ) : (
          <FormattedMessage
            id="shared-component.eto-overview.count-down-to"
            values={{ state: statusToName[state] }}
          />
        )}
      </div>
      <div className={styles.zone}>
        <time dateTime={endDate.toISOString()}>
          {`${moment.utc(endDate).format("ddd, MMM Do YYYY, HH:mm")} UTC`}
        </time>
      </div>
      <Counter endDate={endDate} />
    </div>
  );
};

export { CounterWidget };
