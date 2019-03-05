import { Field, FieldProps } from "formik";
import * as React from "react";

import { OmitKeys } from "../../../../types";
import { CheckboxLayout, RadioButtonLayout } from "../layouts/CheckboxLayout";
import { FormFieldError } from "./FormFieldError";

type LayoutProps = React.ComponentProps<typeof CheckboxLayout>;
type TProps = OmitKeys<LayoutProps, "onChange">;

/*
 * Conditional checkbox.
 * Use when there is a need to represent true/false value (checked === true).
 * If array of values is needed use FormFieldCheckboxGroup
 */
class FormFieldBoolean extends React.Component<TProps> {
  render(): React.ReactNode {
    const { name, checked, disabled, className, ...rest } = this.props;

    return (
      <Field
        name={name}
        render={({ field, form }: FieldProps) => {
          return (
            <div className={className}>
              <CheckboxLayout
                {...field}
                {...rest}
                name={name}
                disabled={disabled}
                checked={checked || form.values[name]}
                onChange={() => form.setFieldValue(name, !form.values[name])}
              />
              <FormFieldError name={name} className="text-left" />
            </div>
          );
        }}
      />
    );
  }
}

class FormRadioButton extends React.Component<TProps> {
  render(): React.ReactNode {
    const { name, checked, disabled } = this.props;

    return (
      <Field
        name={name}
        render={({ field, form }: FieldProps) => {
          const { value } = this.props;

          return (
            <RadioButtonLayout
              {...field}
              {...this.props}
              checked={checked || form.values[name] === value}
              onChange={() => form.setFieldValue(name, value)}
              disabled={disabled}
            />
          );
        }}
      />
    );
  }
}

export { FormRadioButton, FormFieldBoolean };
