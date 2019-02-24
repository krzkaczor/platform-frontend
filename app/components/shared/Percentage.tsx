import BigNumber from "bignumber.js";
import * as React from "react";

type IExternalProps = {
  children: BigNumber;
};

const Percentage: React.FunctionComponent<IExternalProps> = ({ children }) => (
  <>{`${children.mul(100).toString()}%`}</>
);

export { Percentage };
