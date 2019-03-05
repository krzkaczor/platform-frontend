import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";

import * as styles from "./SpinningEthereum.module.scss";

export const SpinningEthereum: React.FunctionComponent<CommonHtmlProps> = ({
  className,
  style,
}) => (
  <div className={cn(styles.wrapper, className)} style={style}>
    <div className={styles.eth}>
      <div className={styles.bottom}>
        <div className={styles.left} />
        <div className={styles.right} />
        <div className={styles.up} />
        <div className={styles.down} />
      </div>

      <div className={styles.top}>
        <div className={styles.left} />
        <div className={styles.right} />
        <div className={styles.up} />
        <div className={styles.down} />
      </div>
    </div>
  </div>
);
