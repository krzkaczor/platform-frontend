import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container, Row } from "reactstrap";
import { compose, setDisplayName } from "recompose";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { Heading } from "../../../shared/modals/Heading";
import { ResponsiveImage } from "../../../shared/ResponsiveImage";

import * as signGraphic from "../../../../assets/img/sign-agreement.svg";

interface IDispatchProps {
  onAccept: () => any;
}

const SignInvestmentAgreementComponent: React.FunctionComponent<IDispatchProps> = ({
  onAccept,
}) => {
  return (
    <Container>
      <Row>
        <Heading>
          <FormattedMessage id="eto.settings.eto-start-date-summary.dates-title" />
        </Heading>
      </Row>

      <Row className="mt-4">
        <ResponsiveImage
          width={2}
          height={1}
          theme={"transparent"}
          srcSet={{ "1x": signGraphic }}
          alt=""
        />
      </Row>

      <Row className="justify-content-center mt-4">
        <Button
          layout={EButtonLayout.PRIMARY}
          type="button"
          onClick={onAccept}
          data-test-id="set-eto-date-summary-confirm-button"
        >
          <FormattedMessage id="download-agreement-widget.sign-on-ethereum" />
        </Button>
      </Row>
    </Container>
  );
};

const SignInvestmentAgreementSummary = compose<IDispatchProps, {}>(
  setDisplayName("SetEtoDateSummary"),
  appConnect<{}, IDispatchProps>({
    dispatchToProps: d => ({
      onAccept: () => d(actions.txSender.txSenderAccept()),
    }),
  }),
)(SignInvestmentAgreementComponent);

export { SignInvestmentAgreementComponent, SignInvestmentAgreementSummary };
