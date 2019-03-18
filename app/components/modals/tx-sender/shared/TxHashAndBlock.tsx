import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { CommonHtmlProps } from "../../../../types";
import { EtherscanTxLink } from "../../../shared/links/EtherscanLink";

import * as styles from "./TxHashAndBlock.module.scss";

export interface ITxPendingProps {
  txHash: string;
  blockId?: number;
}

const TxHashAndBlock: React.FunctionComponent<ITxPendingProps & CommonHtmlProps> = ({
  txHash,
  blockId,
  className,
}) => (
  <div className={className}>
    {txHash && (
      <EtherscanTxLink txHash={txHash} className={styles.txHash}>
        <FormattedMessage id="tx-monitor.details.hash-label" /> {txHash}
      </EtherscanTxLink>
    )}

    {blockId && (
      <p className={cn(styles.blockId, "mb-0 mt-3")}>
        <FormattedMessage id="tx-monitor.details.block-number-label" />
        {": "}
        <span className="text-success">{blockId}</span>
      </p>
    )}
  </div>
);

export { TxHashAndBlock };
