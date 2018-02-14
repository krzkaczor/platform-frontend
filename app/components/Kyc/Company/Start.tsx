import * as React from "react";

import { compose } from "redux";

import { appConnect } from "../../../store";

import { ProgressStepper } from "../../shared/ProgressStepper";

import { actions } from "../../../modules/actions";

import { Button } from "reactstrap";

interface IProps {
  submitForm: () => void;
}

export const KYCCompanyStartComponent: React.SFC<IProps> = props => (
  <div>
    <br />
    <ProgressStepper steps={3} currentStep={2} />
    <br />
    <h1>Company KYC</h1>
    <br />
    Form goes here
    <br />
    <br />
    <br />
    <Button color="primary" onClick={props.submitForm}>
      Submit
    </Button>
  </div>
);

export const KYCCompanyStart = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      submitForm: () => dispatch(actions.kycSubmitCompanyForm()),
    }),
  }),
)(KYCCompanyStartComponent);
