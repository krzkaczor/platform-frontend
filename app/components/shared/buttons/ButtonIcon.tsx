import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TTranslatedString } from "../../../types";
import { InlineIcon } from "../icons";
import { IGeneralButton } from "./Button";

import * as closeIcon from "../../../assets/img/inline_icons/close.svg";
import * as styles from "./ButtonIcon.module.scss";

interface IButtonIcon extends IGeneralButton, CommonHtmlProps {
  svgIcon: string;
  alt?: TTranslatedString;
}

const ButtonIcon: React.FunctionComponent<IButtonIcon> = ({
  onClick,
  className,
  disabled,
  ...props
}) => (
  <button className={cn(styles.buttonIcon, className)} onClick={onClick} disabled={disabled}>
    <InlineIcon {...props} />
  </button>
);

const ButtonIconPlaceholder: React.FunctionComponent = () => (
  <div className={styles.buttonIconPlaceholder} />
);

const ButtonClose: React.FunctionComponent<IGeneralButton & CommonHtmlProps> = props => (
  <ButtonIcon {...props} svgIcon={closeIcon} />
);

export { ButtonIcon, ButtonIconPlaceholder, ButtonClose };
