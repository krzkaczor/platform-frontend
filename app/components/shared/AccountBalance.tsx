import * as React from "react";

import { TDataTestId, TTranslatedString } from "../../types";
import { makeTid } from "../../utils/tidUtils";
import { Button, EButtonLayout } from "./buttons";
import { IMoneySuiteWidgetProps, MoneySuiteWidget } from "./MoneySuiteWidget";

import * as arrowRightIcon from "../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./AccountBalance.module.scss";

type TAction = {
  name: TTranslatedString;
  onClick: () => void;
  disabled?: boolean;
} & TDataTestId;

interface IProps {
  actions?: TAction[];
  withdrawDisabled?: boolean;
  transferDisabled?: boolean;
  dataTestId?: string;
  onWithdrawClick?:()=>void;
  onDepositClick?:()=>void;
}

export const AccountBalance: React.FunctionComponent<
  IProps & IMoneySuiteWidgetProps & TDataTestId
> = ({
  icon,
  currency,
  currencyTotal,
  largeNumber,
  value,
  actions,
  "data-test-id": dataTestId,
}) => {
  return (
    <div className={styles.accountBalance}>
      <MoneySuiteWidget
        icon={icon}
        currency={currency}
        currencyTotal={currencyTotal}
        largeNumber={largeNumber}
        value={value}
        data-test-id={makeTid(dataTestId, "balance-values")}
      />
      <div className={styles.buttons}>
        {actions &&
          actions.map(({ onClick, disabled, name, "data-test-id": dataTestId }, i) => (
            <Button
              key={i}
              layout={EButtonLayout.SIMPLE}
              innerClassName={styles.button}
              iconPosition="icon-after"
              theme="graphite"
              svgIcon={arrowRightIcon}
              onClick={onClick}
              data-test-id={dataTestId}
              disabled={disabled}
            >
              {name}
            </Button>
          ))}
      </div>
    </div>
  );
};
