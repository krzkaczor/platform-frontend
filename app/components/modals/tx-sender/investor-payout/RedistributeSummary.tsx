import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container } from "reactstrap";

import { externalRoutes } from "../../../../config/externalRoutes";
import { actions } from "../../../../modules/actions";
import { IBlTokenDisbursal } from "../../../../modules/investor-portfolio/interfaces/TokenDisbursal";
import { selectTxSummaryAdditionalData } from "../../../../modules/tx/sender/selectors";
import { selectEthereumAddressWithChecksum } from "../../../../modules/web3/selectors";
import { appConnect } from "../../../../store";
import { EthereumAddressWithChecksum } from "../../../../types";
import { withParams } from "../../../../utils/withParams";
import { Button } from "../../../shared/buttons";
import { ExternalLink } from "../../../shared/links";
import { Heading } from "../../../shared/modals/Heading";
import { Money } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

interface IStateProps {
  tokenDisbursal: IBlTokenDisbursal;
  walletAddress: EthereumAddressWithChecksum;
}

interface IDispatchProps {
  onAccept: () => void;
}

type TComponentProps = IStateProps & IDispatchProps;

const InvestorRedistributePayoutSummaryLayout: React.FunctionComponent<TComponentProps> = ({
  walletAddress,
  tokenDisbursal,
  onAccept,
}) => {
  return (
    <Container>
      <Heading className="mb-4">
        <FormattedMessage id="investor-payout.redistribute.summary.title" />
      </Heading>

      <p className="mb-3">
        <FormattedMessage id="investor-payout.redistribute.summary.description" />
      </p>
      <InfoList className="mb-4">
        <InfoRow
          key={tokenDisbursal.currency}
          caption={
            <FormattedMessage id="investor-payout.redistribute.summary.total-redistributed" />
          }
          value={
            <Money value={tokenDisbursal.amountToBeClaimed} currency={tokenDisbursal.currency} />
          }
        />
      </InfoList>
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
        <Button onClick={onAccept} data-test-id="investor-payout.redistribute-summary.accept">
          <FormattedMessage id="investor-payout.redistribute.summary.accept" />
        </Button>
      </section>
    </Container>
  );
};

const InvestorRedistributePayoutSummary = appConnect<IStateProps, IDispatchProps, {}>({
  stateToProps: state => ({
    walletAddress: selectEthereumAddressWithChecksum(state),
    tokenDisbursal: selectTxSummaryAdditionalData(state),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(InvestorRedistributePayoutSummaryLayout);

export { InvestorRedistributePayoutSummary, InvestorRedistributePayoutSummaryLayout };
