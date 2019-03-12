import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { actions } from "../../../../modules/actions";
import { selectTxAdditionalData } from "../../../../modules/tx/sender/selectors";
import { TWithdrawAdditionalData } from "../../../../modules/tx/transactions/withdraw/types";
import { TTxAdditionalData } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { WithdrawTransactionDetails } from "./WithdrawTransactionDetails";

interface IStateProps {
  txData: TTxAdditionalData<TWithdrawAdditionalData>;
}

interface IDispatchProps {
  onAccept: () => void;
}

type TComponentProps = IStateProps & IDispatchProps;

export const WithdrawSummaryComponent: React.FunctionComponent<TComponentProps> = ({
  txData,
  onAccept,
}) => (
  <Container>
    <Row className="mb-4">
      <Col>
        <Heading size={EHeadingSize.SMALL} level={4}>
          <FormattedMessage id="withdraw-flow.summary" />
        </Heading>
      </Col>
    </Row>

    <Row>
      <Col>
        <WithdrawTransactionDetails additionalData={txData} />
      </Col>
    </Row>
    <Row>
      <Col className="text-center">
        <Button
          onClick={onAccept}
          data-test-id="modals.tx-sender.withdraw-flow.summary.accept"
        >
          <FormattedMessage id="withdraw-flow.confirm" />
        </Button>
      </Col>
    </Row>
  </Container>
);

export const WithdrawSummary = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    txData: selectTxAdditionalData(state),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(WithdrawSummaryComponent);
