import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps } from "../../../types";
import { Button, EButtonLayout } from "../../shared/buttons";
import { Date } from "../../shared/Date";
import { InlineIcon } from "../../shared/icons";
import { ECurrency, EMoneyTransfer, Money } from "../../shared/Money";
import { Panel } from "../../shared/Panel";
import { TableBody } from "../../shared/table/TableBody";
import { TableCell } from "../../shared/table/TableCell";
import { TableRow } from "../../shared/table/TableRow";
import { TotalEuro } from "../TotalEuro";

import * as LinkOutIcon from "../../../assets/img/inline_icons/link_out.svg";
import * as styles from "./ClaimedDividends.module.scss";

export interface IDividendPayout {
  timestamp: number;
  amount: string;
  id: any;
}

interface IClaimedDividendsProps {
  totalEurValue: string;
  recentPayouts: IDividendPayout[];
}

const NoPayoutsInfo = () => (
  <div className="py-3">
    <FormattedMessage id="components.wallet.claimed-dividends.you-claimed-no-proceeds" />
  </div>
);
export const ClaimedDividends: React.FunctionComponent<
  IClaimedDividendsProps & CommonHtmlProps
> = ({ totalEurValue, recentPayouts, className, ...htmlProps }) => (
  <Panel
    rightComponent={<TotalEuro totalEurValue={totalEurValue} />}
    className={cn(styles.claimedDividends, className)}
    {...htmlProps}
  >
    <h3 className={styles.title}>
      <FormattedMessage id="components.wallet.claimed-dividends.most-recent" />
    </h3>
    <TableBody>
      {recentPayouts.length === 0 ? (
        <NoPayoutsInfo />
      ) : (
        recentPayouts.map(({ timestamp, amount, id }) => (
          <TableRow key={`table-row-claimed-dividends-${id}`}>
            <TableCell narrow>
              <Date timestamp={timestamp} />
            </TableCell>
            <TableCell narrow>
              <Money
                currency={ECurrency.EUR_TOKEN}
                value={amount}
                transfer={EMoneyTransfer.INCOME}
              />
            </TableCell>
            <TableCell narrow>
              <Button layout={EButtonLayout.SECONDARY}>
                <span>
                  <FormattedMessage id="components.wallet.claimed-dividends.txn" />
                </span>
                <InlineIcon svgIcon={LinkOutIcon} />
              </Button>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Panel>
);
