import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import * as React from "react";
import MaskedInput, { conformToMask, maskArray } from "react-text-mask";

import { CommonHtmlProps } from "../../../../types";
import { FormInputRaw, IFormInputRawExternalProps, InputSize } from "./FormInputRaw";
import { isNonValid } from "./utils";

export interface IMaskedFormInputExternalProps extends IFormInputRawExternalProps {
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
      maxLength,
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
                const val = conformToMask(field.value, mask, {}).conformedValue;

                return (
                  <MaskedInput
                    value={val}
                    placeholder={placeholder}
                    name={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldTouched(name);
                      setFieldValue(name, unmask ? unmask(e.target.value) : e.target.value);
                    }}
                    mask={mask}
                    guide={guided}
                    render={(ref, props) => {
                      return (
                        <FormInputRaw
                          innerRef={ref}
                          name={name}
                          placeholder={placeholder}
                          className={className}
                          addonStyle={addonStyle}
                          prefix={prefix}
                          suffix={suffix}
                          errorMsg={errorMsg}
                          size={size}
                          disabled={disabled}
                          maxLength={maxLength}
                          invalid={invalid}
                          customOnBlur={customOnBlur}
                          {...props}
                          {...mainProps}
                        />
                      );
                    }}
                  />
                );
              }}
            />
          );
        }}
      </FormikConsumer>
    );
  }
}
