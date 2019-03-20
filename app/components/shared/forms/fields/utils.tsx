import { FormikErrors, FormikTouched } from "formik";
import { get, isFunction } from "lodash";
import * as React from "react";
import { FormGroup, InputProps } from "reactstrap";
import { createNumberMask } from "text-mask-addons/dist/textMaskAddons";

import { Dictionary, TTranslatedString } from "../../../../types";
import { getFieldSchema, isRequired } from "../../../../utils/yupUtils";
import { ECurrency, selectDecimalPlaces } from "../../Money";
import { FormFieldLabel } from "./FormFieldLabel";

export interface IFormField {
  name: string;
  label?: TTranslatedString;
}

export const withFormField = (
  Component: React.ComponentType<any>,
): React.FunctionComponent<Dictionary<any> & IFormField> => ({ label, name, ...inputProps }) => (
  <FormGroup>
    {label && <FormFieldLabel name={name}>{label}</FormFieldLabel>}
    <Component name={name} {...inputProps} />
  </FormGroup>
);

/* The function that encapsulates the logic of determining a value for Input field valid property. Note we have to
   return boolean | undefined value. Undefined should be returned when the field has not been touched by the user. */
export const isValid = (
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  key: string,
  submitCount: number,
  ignoreTouched?: boolean,
): boolean | undefined => {
  if (ignoreTouched) return !get(errors, key);

  if (get(touched, key) || submitCount > 0) {
    return !(errors && get(errors, key));
  }

  return undefined;
};

export const isNonValid = (
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  name: string,
  submitCount: number,
  ignoreTouched?: boolean,
): boolean => {
  const valid = isValid(touched, errors, name, submitCount, ignoreTouched);

  return !(valid === undefined || valid === true);
};

export const getComputedValue = (val: InputProps["value"] = "", limit: number | undefined) => {
  if (typeof val === "number" || Array.isArray(val) || !limit) {
    return val;
  }

  return limit && val.length > limit ? val.slice(0, limit - 1) : val;
};

export const withCountedCharacters = (val: InputProps["value"] = "", limit: number) => {
  if (typeof val !== "string") {
    throw new Error("Only strings are supported for character counters");
  }

  return `${val.length}/${limit}`;
};

export const isFieldRequired = (validationSchema: any, name: string) => {
  if (validationSchema) {
    const schema = isFunction(validationSchema) ? validationSchema() : validationSchema;
    const fieldSchema = getFieldSchema(name, schema);
    return isRequired(fieldSchema);
  } else {
    return false;
  }
};

export const generateMaskFromCurrency = (currency: ECurrency, isPrice?: boolean) => {
  const decimalLimit = selectDecimalPlaces(currency, isPrice);
  const integerLimit = 15 - decimalLimit; // when over 16 digits Formik starts to throw errors
  return createNumberMask({
    prefix: "",
    thousandsSeparatorSymbol: " ",
    allowDecimal: true,
    decimalLimit,
    integerLimit,
  });
};
