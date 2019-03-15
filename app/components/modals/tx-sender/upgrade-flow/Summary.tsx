import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import { ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../../modules/actions";
import { selectTxAdditionalData, selectTxDetails } from "../../../../modules/tx/sender/selectors";
import { ETokenType } from "../../../../modules/tx/types";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { DocumentTemplateButton } from "../../../shared/DocumentLink";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { UpgradeTransactionDetails } from "./UpgradeTransactionDetails";

interface IStateProps {
  txData: Readonly<ITxData>;
  additionalData: { tokenType: ETokenType };
}

interface IDispatchProps {
  onAccept: () => any;
  downloadICBMAgreement?: (tokenType: ETokenType) => void;
}

type TComponentProps = IStateProps & IDispatchProps;

export const UpgradeSummaryComponent: React.FunctionComponent<TComponentProps> = ({
  txData,
  onAccept,
  downloadICBMAgreement,
  additionalData,
}) => (
  <Container>
    <Heading className="mb-4" size={EHeadingSize.SMALL} level={4}>
      <FormattedMessage id="upgrade-flow.summary" />
    </Heading>

    <UpgradeTransactionDetails txData={txData} />

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
    additionalData: selectTxAdditionalData(state),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
    downloadICBMAgreement: (tokenType: ETokenType) =>
      d(actions.icbmWalletBalanceModal.downloadICBMWalletAgreement(tokenType)),
  }),
})(UpgradeSummaryComponent);
