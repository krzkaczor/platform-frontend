import * as cn from "classnames";
import * as React from "react";
import { ListGroupItem } from "reactstrap";

import { TDataTestId } from "../../../../types";
import { CopyToClipboardButton } from "../../../shared/CopyToClipboardButton";

import * as styles from "./InfoRow.module.scss";

interface IInfoRowProps {
  caption: React.ReactNode;
  value: React.ReactNode;
  allowClipboardCopy?: boolean;
}

export const InfoRow: React.FunctionComponent<IInfoRowProps & TDataTestId> = ({
  caption,
  value,
  allowClipboardCopy,
  "data-test-id": dataTestId,
}) => (
  <ListGroupItem className={styles.infoRow}>
    <div className={styles.infoCell}>{caption}</div>
    <div className={styles.infoCell}>
      <span data-test-id={dataTestId}>{value}</span>
      {allowClipboardCopy && (
        <CopyToClipboardButton className={cn(styles.copyToClipboard, "ml-2")} value={value} />
      )}
    </div>
  </ListGroupItem>
);
