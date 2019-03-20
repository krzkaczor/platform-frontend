import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TDataTestId, TTranslatedString } from "../../types";
import { EHeadingSize, Heading } from "./Heading";

import * as styles from "./Panel.module.scss";

export interface IPanelProps {
  headerText?: TTranslatedString;
  rightComponent?: React.ReactNode;
  icon?: string;
  narrow?: boolean;
}

const Panel: React.FunctionComponent<IPanelProps & CommonHtmlProps & TDataTestId> = ({
  headerText,
  rightComponent,
  icon,
  className,
  children,
  narrow,
  "data-test-id": dataTestId,
}) => (
  <section
    className={cn(styles.panel, className, { [styles.narrow]: narrow })}
    data-test-id={dataTestId}
  >
    {(headerText || rightComponent) && (
      <div className={cn(styles.header)}>
        {headerText && (
          <Heading level={3} size={EHeadingSize.SMALL} decorator={icon}>
            {headerText}
          </Heading>
        )}
        {rightComponent}
      </div>
    )}

    {children}
  </section>
);

export { Panel };
