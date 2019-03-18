import * as cn from "classnames";
import { FieldAttributes } from "formik";
import * as React from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, InputType, TTranslatedString } from "../../../../types";
import { FormFieldError, generateErrorId } from "./FormFieldError";
import { withCountedCharacters } from "./utils";

import * as styles from "./FormStyles.module.scss";

export enum InputSize {
  NORMAL = "",
  SMALL = "sm",
}

interface IFormInputRawExternalProps {
  min?: string;
  max?: string;
  placeholder?: TTranslatedString;
  errorMsg?: TTranslatedString;
  type?: InputType;
  prefix?: TTranslatedString;
  suffix?: TTranslatedString;
  addonStyle?: string;
  maxLength?: number;
  charactersLimit?: number;
  size?: InputSize;
  customValidation?: (value: any) => string | Function | Promise<void> | undefined;
  onChange?: Function;
  customOnBlur?: Function;
  ignoreTouched?: boolean;
}

export type FormInputComponentProps = IFormInputRawExternalProps &
  FieldAttributes<any> &
  CommonHtmlProps;

const FormInputRaw: React.FunctionComponent<FormInputComponentProps> = ({
  type,
  placeholder,
  name,
  prefix,
  suffix,
  className,
  addonStyle,
  charactersLimit,
  errorMsg,
  size,
  disabled,
  customValidation,
  customOnBlur,
  ignoreTouched,
  maxLength,
  onChange,
  value,
  invalid,
  ...props
}) => (
  <>
    <InputGroup size={size}>
      {prefix && (
        <InputGroupAddon
          addonType="prepend"
          className={cn(styles.addon, addonStyle, { "is-invalid": invalid })}
        >
          {prefix}
        </InputGroupAddon>
      )}
      <Input
        aria-describedby={generateErrorId(name)}
        aria-invalid={invalid}
        invalid={invalid}
        name={name}
        id={name}
        maxLength={maxLength}
        className={cn(className, styles.inputField)}
        onChange={onChange}
        onBlur={(e: React.FocusEvent) => {
          if (customOnBlur) {
            customOnBlur(e);
          }
        }}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...props}
      />
      {suffix && (
        <InputGroupAddon addonType="append" className={cn(styles.addon, { "is-invalid": invalid })}>
          {suffix}
        </InputGroupAddon>
      )}
    </InputGroup>
    <FormFieldError name={name} defaultMessage={errorMsg} ignoreTouched={ignoreTouched} />
    {charactersLimit && <div>{withCountedCharacters(value, charactersLimit)}</div>}
  </>
);

FormInputRaw.defaultProps = {
  size: InputSize.NORMAL,
};

export { FormInputRaw, IFormInputRawExternalProps };
