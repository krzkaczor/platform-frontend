import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container } from "reactstrap";

import { externalRoutes } from "../../../../config/externalRoutes";
import { actions } from "../../../../modules/actions";
import { selectTxAdditionalData } from "../../../../modules/tx/sender/selectors";
import { TAcceptPayoutAdditionalData } from "../../../../modules/tx/transactions/payout/accept/types";
import { TTxAdditionalData } from "../../../../modules/tx/types";
import { selectEthereumAddressWithChecksum } from "../../../../modules/web3/selectors";
import { appConnect } from "../../../../store";
import { EthereumAddressWithChecksum } from "../../../../types";
import { withParams } from "../../../../utils/withParams";
import { Button } from "../../../shared/buttons";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { ExternalLink } from "../../../shared/links";
import { selectCurrencyCode } from "../../../shared/Money";
import { AcceptTransactionDetails } from "./AcceptTransactionDetails";

interface IStateProps {
  additionalData: TTxAdditionalData<TAcceptPayoutAdditionalData>;
  walletAddress: EthereumAddressWithChecksum;
}

interface IDispatchProps {
  onAccept: () => void;
}

type TComponentProps = IStateProps & IDispatchProps;

const InvestorAcceptPayoutSummaryLayout: React.FunctionComponent<TComponentProps> = ({
  walletAddress,
  additionalData,
  onAccept,
}) => {
  return (
    <Container>
      <Heading size={EHeadingSize.SMALL} level={4} className="mb-4">
        <FormattedMessage id="investor-payout.accept.summary.title" />
      </Heading>

      <p className="mb-3">
        {additionalData.tokensDisbursals.length === 1 ? (
          <FormattedMessage
            id="investor-payout.accept.summary.single.description"
            values={{ token: selectCurrencyCode(additionalData.tokensDisbursals[0].token) }}
          />
        ) : (
          <FormattedMessage id="investor-payout.accept.summary.combined.description" />
        )}
      </p>
      <AcceptTransactionDetails additionalData={additionalData} />
      <section className="text-center">
        <ExternalLink
          className="d-inline-block mb-3"
          href={withParams(externalRoutes.commitmentStatus, { walletAddress })}
        >
          <FormattedMessage id="investor-payout.summary.neu-tokenholder-agreement" />
        </ExternalLink>
        <small className="d-inline-block mb-3 mx-4">
          <FormattedMessage id="investor-payout.summary.hint" />
        </small>
        <Button onClick={onAccept} data-test-id="investor-payout.accept-summary.accept">
          <FormattedMessage id="investor-payout.accept.summary.accept" />
        </Button>
      </section>
    </Container>
  );
};

const InvestorAcceptPayoutSummary = appConnect<IStateProps, IDispatchProps, {}>({
  stateToProps: state => ({
    walletAddress: selectEthereumAddressWithChecksum(state),
    additionalData: selectTxAdditionalData(state),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(InvestorAcceptPayoutSummaryLayout);

export { InvestorAcceptPayoutSummary, InvestorAcceptPayoutSummaryLayout };
