import { cloneDeep, flow, get, isFunction, set } from "lodash";

import BigNumber from "bignumber.js";

export interface ICompoundField {
  [x: string]: string | number | undefined;
}

//TODO remove it. Data should come from backend with all defaults set
export const applyDefaults = (data: any, defaults: any) => {
  const dataCopy = { ...data };

  return Object.keys(defaults).reduce((acc, key) => {
    if (acc[key] === undefined || acc[key] === null) {
      acc[key] = defaults[key];
    }
    return acc;
  }, dataCopy);
};

/**** DATA CONVERSION FUNCTIONS ****/

export const convert = (data: any, conversionSpec: any) => {
  if (data) {
    const dataCopy = cloneDeep(data);
    Object.keys(conversionSpec).forEach(key => {
      const fieldValue = get(dataCopy, key);
      console.log("convert", fieldValue, conversionSpec[key], Array.isArray(conversionSpec[key] ))
      if (fieldValue && (isFunction(conversionSpec[key] || Array.isArray(conversionSpec[key] )))) {
        console.log("convert convertField")
        set(dataCopy, key, convertField(fieldValue, conversionSpec[key]));
      } else if (fieldValue){
        console.log("convert else")
        set(dataCopy, key, convert(fieldValue, conversionSpec[key]));
      } else return dataCopy
    });
    return dataCopy;
  } else {
    return data;
  }
};

const convertField = (input: any, f: any) => {
  console.log("convertField", input, f)
  if (Array.isArray(f)) {
    return flow(f)(input);
  } else {
    return input !== undefined && input !== null ? f(input) : input;
  }
};

export const convertInArray = (conversionSpec: any) => (data: Array<any> | ReadonlyArray<any>) => {
  if (Array.isArray(data)) {
    return data.map(element => {
      return convert(element, conversionSpec);
    });
  } else {
    return data;
  }
};

const findNonEmptyKeyValueField = (data: any) => {
  if (data !== undefined && data !== null) {
    const keys = Object.keys(data);
    return data[keys[0]] !== undefined && data[keys[1]] !== undefined;
  }
};

//removes data left from empty key-value fields, e.g. {key:undefined,value:undefined}
export const removeEmptyKeyValueFields = () => (data: ICompoundField[] | undefined) => {
  if (data !== undefined && data !== null) {
    console.log("removeEmptyKeyValueFields",data)
    const cleanData = data.filter(field => findNonEmptyKeyValueField(field));
    return cleanData.length ? cleanData : undefined;
  } else {
    return undefined;
  }
};

//removes empty key-value fields, e.g. {key:undefined,value:undefined}
export const removeEmptyKeyValueField = () => (data: ICompoundField | undefined) => {
  return findNonEmptyKeyValueField(data) ? data : undefined;
};

export const convertPercentageToFraction = () => (data: number) =>
  parseFloat((data / 100).toPrecision(4));

export const convertFractionToPercentage = () => (data: number) =>
  parseFloat((data * 100).toFixed(2));

export const parseStringToFloat = () => (data: string | number | undefined) => {
  if (typeof data === "string") {
    const result = parseFloat(data);
    return Number.isNaN(result) ? undefined : result;
  } else {
    return data;
  }
};

export const parseStringToInteger = () => (data: string | number | undefined) => {
  if (typeof data === "string") {
    const result = parseInt(data, 10);
    return Number.isNaN(result) ? undefined : result;
  } else {
    return data;
  }
};

export const convertToPrecision = (precision: number) => (value: string): string | undefined => {
  const data = new BigNumber(value);
  if (!data.isNaN()) {
    return data.toNumber().toLocaleString(undefined, {
      //fixme toLocaleString()
      maximumFractionDigits: precision,
    });
  } else {
    return undefined;
  }
};
