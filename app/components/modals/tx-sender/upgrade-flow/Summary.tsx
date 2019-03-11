import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../../modules/actions";
import { ETokenType } from "../../../../modules/tx/interfaces";
import {
  selectTxAdditionalData,
  selectTxDetails,
  selectTxGasCostEthUlps,
} from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { DocumentTemplateButton } from "../../../shared/DocumentLink";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { ECurrency, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

interface IStateProps {
  txData: Partial<ITxData>;
  txCost: string;
  additionalData: { tokenType: ETokenType };
}

interface IDispatchProps {
  onAccept: () => any;
  downloadICBMAgreement?: (tokenType: ETokenType) => void;
}

type TComponentProps = IStateProps & IDispatchProps;

export const UpgradeSummaryComponent: React.FunctionComponent<TComponentProps> = ({
  txData,
  txCost,
  onAccept,
  downloadICBMAgreement,
  additionalData,
}) => (
  <Container>
    <Row className="mb-4">
      <Col>
        <Heading size={EHeadingSize.SMALL} level={4}>
          <FormattedMessage id="upgrade-flow.summary" />
        </Heading>
      </Col>
    </Row>

    <Row>
      <Col>
        <InfoList>
          <InfoRow caption={<FormattedMessage id="upgrade-flow.to" />} value={txData.to} />

          <InfoRow
            caption={<FormattedMessage id="upgrade-flow.value" />}
            value={<Money currency={ECurrency.ETH} value={txData.value!} />}
          />

          <InfoRow
            caption={<FormattedMessage id="upgrade-flow.transaction-cost" />}
            value={<Money currency={ECurrency.ETH} value={txCost} />}
          />
        </InfoList>
      </Col>
    </Row>
    {downloadICBMAgreement && (
      <Row>
        <Col className="my-3 text-center">
          <DocumentTemplateButton
            onClick={() => downloadICBMAgreement(additionalData.tokenType)}
            title={<FormattedMessage id="wallet.icbm.reservation-agreement" />}
          />
        </Col>
      </Row>
    )}
    <Row>
      <Col className="text-center">
        <Button
          onClick={onAccept}
          innerClassName="mt-4"
          data-test-id="modals.tx-sender.withdraw-flow.summery.withdrawSummery.accept"
        >
          <FormattedMessage id="withdraw-flow.confirm" />
        </Button>
      </Col>
    </Row>
  </Container>
);

export const UpgradeSummary = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    txData: selectTxDetails(state)!,
    txCost: selectTxGasCostEthUlps(state),
    additionalData: selectTxAdditionalData(state),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
    downloadICBMAgreement: (tokenType: ETokenType) =>
      d(actions.icbmWalletBalanceModal.downloadICBMWalletAgreement(tokenType)),
  }),
})(UpgradeSummaryComponent);
