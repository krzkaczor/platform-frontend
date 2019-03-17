import BigNumber from "bignumber.js";
import { FormikContext } from "formik";
import { CSSProperties } from "react";
import { FormattedMessage } from "react-intl-phraseapp";

export type Dictionary<T> = Record<string, T>;

// opaque types can provide semantic information to simpler types like strings etc
// read: https://codemix.com/opaque-types-in-javascript/
type Opaque<K, T> = T & { __TYPE__: K };

export type EthereumNetworkId = Opaque<"EthereumNetworkId", string>;
export type EthereumAddress = Opaque<"EthereumAddress", string>;
export type EthereumAddressWithChecksum = Opaque<"EthereumAddressWithChecksum", string>;
export type FunctionWithDeps = Opaque<"FunctionWithDeps", Function>;

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : DeepPartial<T[P]>
};

export type TDictionaryValues<T> = T extends Dictionary<infer U> ? U : never;
export type TDictionaryArrayValues<T> = T extends Array<Dictionary<infer U>> ? U : never;

export type Primitive = string | number | boolean | undefined | null;

/**
 * Types allowed to keep as writable
 */
type WhitelistedWritableTypes = Date | BigNumber;
export type DeepReadonly<T> = T extends Primitive | WhitelistedWritableTypes
  ? T
  : T extends Array<infer U> ? ReadonlyArray<U> : T extends Function ? T : DeepReadonlyObject<T>;

export type DeepReadonlyObject<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };

export type FirstParameterType<T> = T extends (param: infer R) => any ? R : never;

// Taken from @types/reactstrap
// @see https://github.com/DefinitelyTyped/DefinitelyTyped/pull/23700
export type InputType =
  | "text"
  | "email"
  | "select"
  | "file"
  | "radio"
  | "checkbox"
  | "textarea"
  | "button"
  | "reset"
  | "submit"
  | "date"
  | "datetime-local"
  | "hidden"
  | "image"
  | "month"
  | "number"
  | "range"
  | "search"
  | "tel"
  | "url"
  | "week"
  | "password"
  | "datetime"
  | "time"
  | "color";

// we dont use AllHtmlAttributes because they include many more fields which can collide easily with components props (like data)
export type CommonHtmlProps = {
  className?: string;
  style?: CSSProperties;
};

export type TTranslatedString = string | React.ReactElement<FormattedMessage.Props>;

export type TDataTestId = {
  "data-test-id"?: string;
};

export type TAcceptedFileType =
  | string
  | "application/pdf"
  | "image/png"
  | "image/jpg"
  | "image/jpeg"
  | "image/svg+xml"
  | "image/*";

/**
 * From T, omit a set of properties whose keys are in the union K
 * @example OmitKeys<{ foo: boolean, bar: string }, "foo">
 */
export type OmitKeys<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * From T, omit a set of properties from K
 * @example OmitKeys<{ foo: boolean, bar: string }, { foo: boolean, }> // { bar: string }
 */
export type Omit<T extends K, K> = OmitKeys<T, keyof K>;

/**
 * From T, select a union of property names which values extends R
 * @example
 * SelectPropertyNames<{ foo: boolean, bar: string, baz: string }, string> // "bar" | "baz"
 */
type SelectPropertyNames<T, R> = { [K in keyof T]: T[K] extends R ? K : never }[keyof T];

/**
 * From T, pick only properties which values extends R
 * @example
 * PickProperties<{ foo: boolean, bar: string, baz: string }, string> // { bar: string, baz: string }
 */
type PickProperties<T, R> = Pick<T, SelectPropertyNames<T, R>>;

export type Overwrite<T1, T2> = { [P in Exclude<keyof T1, keyof T2>]: T1[P] } & T2;

export type TFormikConnect = {
  formik: FormikContext<any>;
};

export type TElementRef<T> = null | T;
