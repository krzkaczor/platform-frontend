import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TEtoSetDateAdditionalData } from "../../../../modules/tx/transactions/eto-flow/types";
import { TTxAdditionalData } from "../../../../modules/tx/types";
import { TimeLeft } from "../../../shared/TimeLeft";
import { localTime, utcTime, weekdayLocal, weekdayUTC } from "../../../shared/utils";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

export interface ITxPendingProps {
  additionalData: TTxAdditionalData<TEtoSetDateAdditionalData>;
}
const SetDateDetails: React.FunctionComponent<ITxPendingProps> = ({ additionalData }) => {
  const newStartDate = additionalData.newStartDate;

  return (
    <InfoList className="mb-4">
      <InfoRow
        caption={<FormattedMessage id="eto.settings.eto-start-date-summary.time-to-start-date" />}
        value={<TimeLeft refresh={false} asUtc={false} finalTime={newStartDate} />}
        data-test-id="set-eto-date-summary-time-to-eto"
      />
      <InfoRow
        caption={<FormattedMessage id="eto.settings.eto-start-date-summary.new-start-date-utc" />}
        value={`${weekdayUTC(newStartDate)}, ${utcTime(newStartDate)}`}
      />
      <InfoRow
        caption={<FormattedMessage id="eto.settings.eto-start-date-summary.new-start-date-local" />}
        value={`${weekdayLocal(newStartDate)}, ${localTime(newStartDate)}`}
      />
    </InfoList>
  );
};

export { SetDateDetails };
