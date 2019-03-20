import * as cn from "classnames";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon, InputProps } from "reactstrap";

import { TTranslatedString } from "../../../../types";
import { FormError } from "./FormFieldError";
import { FormLabel } from "./FormFieldLabel";
import { IFormInputRawExternalProps } from "./FormInputRaw";
import { getComputedValue, withCountedCharacters } from "./utils";

import * as styles from "./FormStyles.module.scss";

export interface IFieldGroupRawExternalProps {
  name: string;
  label?: TTranslatedString;
  charactersLimit?: number;
  invalid?: boolean;
  renderInput?: (props: FieldGroupRawProps) => React.ReactNode;
}

type FieldGroupRawProps = IFormInputRawExternalProps & IFieldGroupRawExternalProps & InputProps;

const FormFieldRaw: React.FunctionComponent<FieldGroupRawProps> = ({
  value,
  name,
  label,
  prefix,
  suffix,
  className,
  addonStyle,
  charactersLimit,
  errorMsg,
  renderInput,
  invalid,
  ...props
}) => {
  const computedValue = getComputedValue(value, charactersLimit);
  const isInvalid = invalid || !!errorMsg;

  const inputProps = {
    name,
    id: name,
    className: cn(className, styles.inputField),
    value: computedValue,
    invalid: isInvalid,
    valid: !isInvalid,
    ...props,
  };

  const renderInputElement = renderInput
    ? renderInput
    : (props: FieldGroupRawProps) => <Input {...props} />;

  return (
    <FormGroup>
      {label && <FormLabel for={name}>{label}</FormLabel>}
      <InputGroup className={cn(invalid && "is-invalid")}>
        {prefix && (
          <InputGroupAddon addonType="prepend" className={cn(styles.addon, addonStyle)}>
            {prefix}
          </InputGroupAddon>
        )}
        {renderInputElement(inputProps)}
        {suffix && (
          <InputGroupAddon addonType="append" className={cn(styles.addon, addonStyle)}>
            {suffix}
          </InputGroupAddon>
        )}
      </InputGroup>
      {errorMsg && <FormError name={name} message={errorMsg} />}
      {charactersLimit && <div>{withCountedCharacters(computedValue, charactersLimit)}</div>}
    </FormGroup>
  );
};

export { FormFieldRaw };
