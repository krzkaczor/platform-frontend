import * as React from "react";

import { EHeadingSize, Heading } from "../../shared/Heading";

interface IProps {
  title: string | React.ReactNode;
  step?: number;
  "data-test-id"?: string;
  hasDecorator?: boolean;
  className?: string;
  size?: EHeadingSize;
}

const DashboardSection: React.FunctionComponent<IProps> = ({
  title,
  step,
  "data-test-id": dataTestId,
  hasDecorator,
  className = "my-4",
  size,
}) => (
  <Heading
    level={3}
    className={className}
    decorator={hasDecorator}
    size={size}
    data-test-id={dataTestId}
  >
    {step && <>STEP {step}:</>} {title}
  </Heading>
);

export { DashboardSection };
