import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { Confetti } from "../Confetti";
import { SpinningEthereum } from "./SpinningEthereum";

export const ConfettiEthereum: React.FunctionComponent<CommonHtmlProps> = ({
  className,
  style,
}) => (
  <Confetti className={className} style={style}>
    <SpinningEthereum />
  </Confetti>
);
