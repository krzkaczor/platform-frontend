import * as cn from "classnames";
import * as React from "react";
import { Col, Row } from "reactstrap";

import { TTranslatedString } from "../../types";
import { ProgressStepper } from "./ProgressStepper";

import * as styles from "./HeaderProgressStepper.module.scss";

interface IProps {
  steps: number;
  currentStep: number;
  headerText: TTranslatedString;
  descText?: TTranslatedString;
  warning?: boolean;
  headerClassName?: string;
}

export const HeaderProgressStepper: React.FunctionComponent<IProps> = props => (
  <>
    <Row className="mb-2">
      <Col>
        <ProgressStepper steps={props.steps} currentStep={props.currentStep} />
      </Col>
    </Row>
    <Row className="mt-4 mb-4 text-center">
      <Col>
        <h2 className={cn(styles.bold, { "text-warning": props.warning }, props.headerClassName)}>
          {props.headerText}
        </h2>
        {props.descText && <p className="pt-3">{props.descText}</p>}
      </Col>
    </Row>
  </>
);
