import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import * as React from "react";

import { CommonHtmlProps } from "../../../../types";
import { FormInputRaw, IFormInputRawExternalProps } from "./FormInputRaw";
import { getComputedValue, isNonValid } from "./utils";

export type FormInputProps = IFormInputRawExternalProps & FieldAttributes<any> & CommonHtmlProps;

const transform = (value: string, charactersLimit?: number) => {
  return value !== undefined ? getComputedValue(value, charactersLimit) : "";
};

const transformBack = (value: number | string) => {
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    return value.trim().length > 0 ? value : undefined;
  } else {
    return undefined;
  }
};

/**
 * Formik connected form input without FormGroup and FormFieldLabel.
 */
export const FormInput: React.FunctionComponent<FormInputProps> = ({
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
  ...props
}) => (
  <FormikConsumer>
    {({ touched, errors, setFieldTouched, setFieldValue, submitCount }) => {
      const invalid = isNonValid(touched, errors, name, submitCount, ignoreTouched);

      return (
        <Field
          name={name}
          validate={customValidation}
          render={({ field }: FieldProps) => {
            const val = transform(field.value, charactersLimit);
            return (
              <FormInputRaw
                name={name}
                placeholder={placeholder}
                className={className}
                addonStyle={addonStyle}
                prefix={prefix}
                suffix={suffix}
                errorMsg={errorMsg}
                size={size}
                value={val}
                disabled={disabled}
                maxLength={maxLength}
                customOnBlur={customOnBlur}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFieldTouched(name);
                  setFieldValue(
                    name,
                    transformBack(
                      type === "number" && e.target.value !== ""
                        ? e.target.valueAsNumber
                        : e.target.value,
                    ),
                  );
                }}
                invalid={invalid}
                {...props}
              />
            );
          }}
        />
      );
    }}
  </FormikConsumer>
);
