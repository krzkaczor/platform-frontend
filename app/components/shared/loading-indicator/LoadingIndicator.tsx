import * as cn from "classnames";
import * as React from "react";

import { LoadingIndicatorHexagon } from "./LoadingIndicatorHexagon";

import * as styles from "./LoadingIndicator.module.scss";

type TLoadingIndicator = "pulse" | "blocks" | "hexagon";

interface ILoadingIndicatorProps {
  className?: string;
  light?: boolean;
  type?: TLoadingIndicator;
}

const LoadingIndicator: React.FunctionComponent<ILoadingIndicatorProps> = ({
  className,
  light,
  type = "pulse",
}) => {
  switch (type) {
    case "pulse":
      return (
        <div
          data-test-id="loading-indicator-pulse"
          className={cn(className, styles.spinner, { [styles.light]: light })}
        />
      );
    case "blocks":
      return (
        <div className={cn(className, styles.blocks)}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      );
    case "hexagon":
      return <LoadingIndicatorHexagon />;
    default:
      throw new Error(`Invalid loading indicator type "${type}"`);
  }
};

export { LoadingIndicator };
