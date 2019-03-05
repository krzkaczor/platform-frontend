import * as React from "react";
import { FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import * as styles from "./EndTimeWidget.module.scss";

interface IExternalProps {
  endTime: Date | undefined;
}

const EndTimeWidget: React.FunctionComponent<IExternalProps> = ({ endTime }) => {
  return (
    <span className={styles.endTime}>
      {endTime && (
        <FormattedMessage
          id="shared-component.eto-overview.invest.ends-in"
          values={{
            //initial now is necessary for storybook tests
            endsIn: <FormattedRelative value={endTime} initialNow={new Date()} style="numeric" />,
          }}
        />
      )}
    </span>
  );
};

export { EndTimeWidget };
