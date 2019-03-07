import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../../modules/actions";
import {
  selectTxAdditionalData,
  selectTxGasCostEthUlps,
} from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { Heading } from "../../../shared/modals/Heading";
import { ECurrency, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

interface IStateProps {
  txData: Partial<ITxData>;
  txCost: string;
}

interface IDispatchProps {
  onAccept: () => any;
}

type TComponentProps = IStateProps & IDispatchProps;

export const WithdrawSummaryComponent: React.FunctionComponent<TComponentProps> = ({
  txData,
  txCost,
  onAccept,
}) => (
  <Container>
    <Row className="mb-4">
      <Col>
        <Heading>
          <FormattedMessage id="withdraw-flow.summary" />
        </Heading>
      </Col>
    </Row>

    <Row>
      <Col>
        <InfoList>
          <InfoRow
            caption={<FormattedMessage id="withdraw-flow.to" />}
            value={txData.to}
            data-test-id="modals.tx-sender.withdraw-flow.summary.to"
          />

          <InfoRow
            caption={<FormattedMessage id="withdraw-flow.value" />}
            value={<Money currency={ECurrency.ETH} value={txData.value!} />}
            data-test-id="modals.tx-sender.withdraw-flow.summary.value"
          />

          <InfoRow
            caption={<FormattedMessage id="withdraw-flow.transaction-cost" />}
            value={<Money currency={ECurrency.ETH} value={txCost} />}
            data-test-id="modals.tx-sender.withdraw-flow.summary.cost"
          />
        </InfoList>
      </Col>
    </Row>
    <Row>
      <Col className="text-center">
        <Button
          onClick={onAccept}
          innerClassName="mt-4"
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
    txCost: selectTxGasCostEthUlps(state),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(WithdrawSummaryComponent);
