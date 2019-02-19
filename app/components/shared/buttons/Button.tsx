import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { InlineIcon } from "../InlineIcon";
import { LoadingIndicator } from "../loading-indicator";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./Button.module.scss";

type TButtonTheme = "dark" | "white" | "brand" | "silver" | "graphite" | "neon" | "green" | "blue";
type TIconPosition = "icon-before" | "icon-after";

export enum EButtonLayout {
  PRIMARY = styles.buttonPrimary,
  SECONDARY = styles.buttonSecondary,
  INLINE = styles.buttonInline,
  SIMPLE = styles.buttonSimple,
}

export enum ButtonSize {
  NORMAL = "",
  SMALL = "small",
  HUGE = "huge",
}

export enum ButtonWidth {
  NORMAL = "",
  WIDE = "wide",
  BLOCK = "block",
}

export enum ButtonTextPosition {
  CENTER = "",
  LEFT = "text-left",
  RIGHT = "text-right",
}

export interface IGeneralButton {
  onClick?: (event: any) => void;
  disabled?: boolean;
}

export interface IButtonProps extends IGeneralButton, CommonHtmlProps {
  layout?: EButtonLayout;
  theme?: TButtonTheme;
  svgIcon?: string;
  type?: string;
  iconPosition?: TIconPosition;
  size?: ButtonSize;
  width?: ButtonWidth;
  isLoading?: boolean;
  isActive?: boolean;
  innerClassName?: string;
  textPosition?: ButtonTextPosition;
}

const buttonThemeClassNames: Record<TButtonTheme, string> = {
  dark: styles.buttonDark,
  white: styles.buttonWhite,
  brand: styles.buttonBrand,
  silver: styles.buttonSilver,
  graphite: styles.buttonGraphite,
  neon: styles.buttonNeon,
  green: styles.buttonGreen,
  blue: styles.buttonBlue,
};

const Button: React.ForwardRefExoticComponent<
  { children?: React.ReactNode } & IButtonProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef<HTMLButtonElement, IButtonProps>(
  (
    {
      children,
      className,
      layout,
      theme,
      disabled,
      svgIcon,
      innerClassName,
      iconPosition,
      size,
      width,
      isLoading,
      type,
      textPosition,
      isActive,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(
        styles.button,
        className,
        layout,
        iconPosition,
        {
          [buttonThemeClassNames[theme!]]: layout !== EButtonLayout.INLINE,
          [styles.isActive]: isActive,
        },
        layout !== EButtonLayout.INLINE ? size : null,
        width,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...props}
    >
      <div className={cn(styles.content, innerClassName, textPosition)} tabIndex={-1}>
        {isLoading ? (
          <LoadingIndicator light />
        ) : (
          <>
            {iconPosition === "icon-before" && <InlineIcon svgIcon={svgIcon || ""} />}
            {children}
            {iconPosition === "icon-after" && <InlineIcon svgIcon={svgIcon || ""} />}
          </>
        )}
      </div>
    </button>
  ),
);

Button.defaultProps = {
  layout: EButtonLayout.PRIMARY,
  theme: "dark",
  type: "button",
  disabled: false,
  size: ButtonSize.NORMAL,
  width: ButtonWidth.NORMAL,
};

const ButtonArrowRight: React.FunctionComponent<IButtonProps> = props => (
  <Button
    {...props}
    layout={EButtonLayout.SECONDARY}
    iconPosition="icon-after"
    svgIcon={arrowRight}
  />
);

export { ButtonArrowRight, Button };
