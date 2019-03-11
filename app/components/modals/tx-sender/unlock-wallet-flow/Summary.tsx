import BigNumber from "bignumber.js";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";
import { compose, lifecycle, withState } from "recompose";

import { PLATFORM_UNLOCK_FEE } from "../../../../config/constants";
import { actions } from "../../../../modules/actions";
import { selectTxGasCostEthUlps } from "../../../../modules/tx/sender/selectors";
import {
  selectEtherLockedNeumarksDue,
  selectLockedEtherBalance,
  selectLockedEtherUnlockDate,
} from "../../../../modules/wallet/selectors";
import { getUnlockedWalletEtherAmountAfterFee } from "../../../../modules/wallet/utils";
import { appConnect } from "../../../../store";
import { getCurrentUTCTimestamp } from "../../../../utils/Date.utils";
import { Button } from "../../../shared/buttons";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { ECurrency, Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

interface IStateProps {
  txCost: string;
  neumarksDue: string;
  etherLockedBalance: string;
  unlockDate: string;
}

interface IDispatchProps {
  onAccept: () => any;
}

interface IAdditionalProps {
  returnedEther: BigNumber;
  updateReturnedFunds: (returnedEther: BigNumber) => void;
}

type TComponentProps = IStateProps & IDispatchProps & IAdditionalProps;

export const UnlockFundsSummaryComponent: React.FunctionComponent<TComponentProps> = ({
  txCost,
  neumarksDue,
  etherLockedBalance,
  onAccept,
  returnedEther,
}) => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Heading size={EHeadingSize.SMALL} level={4}>
            <FormattedMessage id="unlock-funds-flow.summary" />
          </Heading>
        </Col>
      </Row>

      <Row>
        <Col>
          <InfoList>
            <InfoRow
              caption={<FormattedMessage id="unlock-funds-flow.eth-committed" />}
              value={<Money currency={ECurrency.ETH} value={etherLockedBalance} />}
            />
            <InfoRow
              caption={<FormattedMessage id="unlock-funds-flow.neumarks-due" />}
              value={<Money currency={ECurrency.NEU} value={neumarksDue} />}
            />
            <InfoRow
              caption={
                <FormattedMessage
                  id="unlock-funds-flow.fee"
                  values={{
                    fee: PLATFORM_UNLOCK_FEE * 100,
                  }}
                />
              }
              value={null}
            />
            <InfoRow
              caption={<FormattedMessage id="unlock-funds-flow.amount-returned" />}
              value={<Money currency={ECurrency.ETH} value={returnedEther} />}
            />
            <InfoRow
              caption={<FormattedMessage id="unlock-funds-flow.transaction-cost" />}
              value={<Money currency={ECurrency.ETH} value={txCost} />}
            />
          </InfoList>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button
            onClick={onAccept}
            innerClassName="mt-4"
            data-test-id="modals.tx-sender.withdraw-flow.summery.unlock-funds-summary.accept"
          >
            <FormattedMessage id="withdraw-flow.confirm" />
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export const UnlockWalletSummary = compose<TComponentProps, any>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      txCost: selectTxGasCostEthUlps(state),
      neumarksDue: selectEtherLockedNeumarksDue(state),
      etherLockedBalance: selectLockedEtherBalance(state),
      unlockDate: selectLockedEtherUnlockDate(state),
    }),
    dispatchToProps: d => ({
      onAccept: () => d(actions.txSender.txSenderAccept()),
    }),
  }),
  withState("returnedEther", "updateReturnedFunds", 0),
  lifecycle<TComponentProps, any>({
    componentDidUpdate(): void {
      const { updateReturnedFunds, unlockDate, etherLockedBalance } = this.props;
      setTimeout(() => {
        updateReturnedFunds(
          getUnlockedWalletEtherAmountAfterFee(
            new BigNumber(etherLockedBalance),
            // TODO: Remove with https://github.com/Neufund/platform-frontend/issues/2156
            unlockDate,
            getCurrentUTCTimestamp(),
          ),
        );
      }, 1000);
    },
  }),
)(UnlockFundsSummaryComponent);
