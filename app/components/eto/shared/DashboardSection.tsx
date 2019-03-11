import * as React from "react";
import { Col } from "reactstrap";

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
  <Col xs={12} data-test-id={dataTestId}>
    <Heading level={3} className={className} decorator={hasDecorator} size={size}>
      {step && <>STEP {step}:</>} {title}
    </Heading>
  </Col>
);

export { DashboardSection };
