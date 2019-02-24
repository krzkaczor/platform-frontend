import BigNumber from "bignumber.js";
import { mapValues } from "lodash";

import { NumericString } from "../../types";

export function numericValuesToString<T extends { [P in keyof T]: string | BigNumber }>(
  entity: T,
): { [P in keyof T]: string } {
  return mapValues(entity, e => e.toString() as NumericString) as any;
}
