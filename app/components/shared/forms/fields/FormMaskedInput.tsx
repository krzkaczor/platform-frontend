import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import MaskedInput, { maskArray } from "react-text-mask";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { FormFieldError, generateErrorId } from "./FormFieldError";
import { isNonValid } from "./utils";

import * as styles from "./FormStyles.module.scss";

export enum InputSize {
  NORMAL = "",
  SMALL = "sm",
}

export interface IMaskedFormInputExternalProps {
  min?: string;
  max?: string;
  placeholder?: TTranslatedString;
  errorMsg?: TTranslatedString;
  prefix?: TTranslatedString;
  suffix?: TTranslatedString;
  addonStyle?: string;
  maxLength?: number;
  size?: InputSize;
  customValidation?: (value: any) => string | Function | Promise<void> | undefined;
  customOnBlur?: Function;
  ignoreTouched?: boolean;
  mask: maskArray;
  guided?: boolean;
}

export type FormInputProps = IMaskedFormInputExternalProps & FieldAttributes<any> & CommonHtmlProps;

/**
 * Formik connected form input without FormGroup and FormFieldLabel.
 */
export class FormMaskedInput extends React.Component<FormInputProps> {
  static defaultProps = {
    size: InputSize.NORMAL,
  };

  render(): React.ReactNode {
    const {
      placeholder,
      name,
      prefix,
      suffix,
      className,
      addonStyle,
      errorMsg,
      size,
      disabled,
      customValidation,
      customOnBlur,
      ignoreTouched,
      mask,
      unmask,
      guided,
      ...mainProps
    } = this.props;
    return (
      <FormikConsumer>
        {({ touched, errors, setFieldTouched, setFieldValue, submitCount }) => {
          const invalid = isNonValid(touched, errors, name, submitCount, ignoreTouched);

          return (
            <Field
              name={name}
              validate={customValidation}
              render={({ field }: FieldProps) => {
                return (
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
                      <MaskedInput
                        value={field.value}
                        placeholder={placeholder}
                        name={name}
                        onChange={e => {
                          setFieldTouched(name);
                          setFieldValue(name, unmask ? unmask(e.target.value) : e.target.value);
                        }}
                        onBlur={e => {
                          if (customOnBlur) {
                            customOnBlur(e);
                          }
                        }}
                        mask={mask}
                        guide={guided}
                        render={(ref, props) => {
                          return (
                            <Input
                              aria-describedby={generateErrorId(name)}
                              aria-invalid={invalid}
                              invalid={invalid}
                              id={name}
                              name={name}
                              innerRef={ref}
                              className={cn(className, styles.inputField)}
                              placeholder={placeholder}
                              disabled={disabled}
                              {...props}
                              {...mainProps}
                            />
                          );
                        }}
                      />
                      {suffix && (
                        <InputGroupAddon
                          addonType="append"
                          className={cn(styles.addon, { "is-invalid": invalid })}
                        >
                          {suffix}
                        </InputGroupAddon>
                      )}
                    </InputGroup>
                    <FormFieldError
                      name={name}
                      defaultMessage={errorMsg}
                      ignoreTouched={ignoreTouched}
                    />
                  </>
                );
              }}
            />
          );
        }}
      </FormikConsumer>
    );
  }
}
