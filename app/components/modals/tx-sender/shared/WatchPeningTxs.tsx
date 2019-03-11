import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { SpinningEthereum } from "../../../shared/ethererum";
import { EtherscanTxLink } from "../../../shared/links";

import * as styles from "./TxHashAndBlock.module.scss";

export interface IProps {
  txHash?: string;
  blockId?: number;
}

export const WatchPendingTxs: React.FunctionComponent<IProps> = ({ txHash, blockId }) => (
  <div className="text-center" test-data-id="modals.shared.tx-pending.modal">
    <SpinningEthereum className="mb-3" />

    <h3 className={styles.title}>
      <FormattedMessage id="tx-sender.tx-pending-watching.title" />
    </h3>

    <p>
      <FormattedMessage id="tx-sender.tx-pending-watching.description" />
    </p>

    {txHash && (
      <EtherscanTxLink txHash={txHash} className={styles.txHash}>
        <FormattedMessage id="tx-monitor.details.hash-label" /> {txHash}
      </EtherscanTxLink>
    )}

    {blockId && (
      <p>
        <FormattedMessage id="tx-monitor.details.block-number-label" />
        {": "}
        <span className={styles.blockId}>{blockId}</span>
      </p>
    )}
  </div>
);
