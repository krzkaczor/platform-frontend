import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { IPanelProps, Panel } from "../../shared/Panel";
import { TotalEuro } from "../TotalEuro";

import * as styles from "./WalletBalance.module.scss";

export interface IWalletValues {
  ethAmount: BigNumber;
  ethEuroAmount: BigNumber;
  neuroAmount: BigNumber;
  neuroEuroAmount: BigNumber;
  totalEuroAmount: BigNumber;
}

export const LoadingWallet: React.FunctionComponent<IPanelProps> = props => {
  return (
    <WalletBalanceContainer {...props}>
      <LoadingIndicator />
    </WalletBalanceContainer>
  );
};

export const WalletBalanceContainer: React.FunctionComponent<
  IPanelProps &
    CommonHtmlProps & {
      data?: IWalletValues;
    }
> = ({ headerText, data, className, children }) => {
  return (
    <Panel
      headerText={headerText}
      rightComponent={data && <TotalEuro totalEurValue={data.totalEuroAmount} />}
      className={cn(className, "d-flex flex-column")}
    >
      <div className={styles.wrapper}>{children}</div>
    </Panel>
  );
};
