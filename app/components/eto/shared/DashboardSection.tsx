import * as React from "react";

import { ESectionHeaderSize, SectionHeader } from "../../shared/SectionHeader";

interface IProps {
  title: string | React.ReactNode;
  step?: number;
  "data-test-id"?: string;
  hasDecorator?: boolean;
  className?: string;
  size?: ESectionHeaderSize;
}

const DashboardSection: React.FunctionComponent<IProps> = ({
  title,
  step,
  "data-test-id": dataTestId,
  hasDecorator,
  className = "my-4",
  size,
}) => (
    <SectionHeader className={className} decorator={hasDecorator} size={size} data-test-id={dataTestId}>
      {step && <>STEP {step}:</>} {title}
    </SectionHeader>
);

export { DashboardSection };
