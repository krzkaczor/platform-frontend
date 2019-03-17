import * as cn from "classnames";
import { isString } from "lodash";
import * as React from "react";

import { CommonHtmlProps, TDataTestId, TTranslatedString } from "../../types";
import { invariant } from "../../utils/invariant";

import * as styles from "./Heading.module.scss";

export enum EHeadingSize {
  SMALL = styles.small,
}

interface IProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  titleClassName?: string;
  description?: TTranslatedString;
  decorator?: boolean | string;
  size?: EHeadingSize;
}

export const Heading: React.FunctionComponent<IProps & TDataTestId & CommonHtmlProps> = ({
  level,
  children,
  className,
  titleClassName,
  decorator,
  description,
  size,
  "data-test-id": dataTestId,
}) => {
  invariant(
    !isString(decorator) || !description,
    "Svg icon and description at the same time are not supported",
  );

  return (
    <header
      data-test-id={dataTestId}
      className={cn(styles.headingWrapper, size, className, {
        [styles.hasDecorator]: decorator === true,
      })}
    >
      {/* To dynamically create heading tag need to manually use `React.createElement` */}
      {React.createElement(
        `h${level}`,
        {
          className: cn(styles.heading, titleClassName, { [styles.hasIcon]: isString(decorator) }),
        },
        isString(decorator) &&
          React.createElement("img", {
            className: styles.icon,
            src: decorator,
            alt: "",
          }),
        children,
      )}
      {description && <p className={cn(styles.description)}>{description}</p>}
    </header>
  );
};

Heading.defaultProps = {
  decorator: true,
};
