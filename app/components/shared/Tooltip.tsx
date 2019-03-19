import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TTranslatedString } from "../../types";
import { CustomTooltip } from "./CustomTooltip";
import { InlineIcon } from "./icons";

import * as icon from "../../assets/img/inline_icons/icon_questionmark.svg";
import * as styles from "./Tooltip.module.scss";

interface IProps {
  content: TTranslatedString;
  isOpen?: boolean;
  alignLeft?: boolean;
  targetId?: string;
}

let tooltipCount = 0;

const Tooltip: React.FunctionComponent<IProps & CommonHtmlProps> = ({
  content,
  className,
  isOpen,
  alignLeft,
  targetId,
}) => (
  <span className={cn(className, styles.tooltipWrapper)} onClick={e => e.preventDefault()}>
    <span
      key={targetId} // add specific key to recreate dom, when tooltipId changed dynamically
      className={styles.tooltip}
      id={targetId}
    >
      <InlineIcon svgIcon={icon} />
    </span>
    <CustomTooltip
      key={`${targetId}-container`} // add specific key to recreate dom, when tooltipId changed dynamically
      isOpen={isOpen}
      target={targetId!}
      className={cn(alignLeft && styles.alignLeft)}
    >
      {content}
    </CustomTooltip>
  </span>
);

Tooltip.defaultProps = {
  targetId: `tooltip-${tooltipCount++}`,
};

export { Tooltip };
