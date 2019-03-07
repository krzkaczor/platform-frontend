import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container } from "reactstrap";

import { externalRoutes } from "../../../../config/externalRoutes";
import { actions } from "../../../../modules/actions";
import { ITokenDisbursal } from "../../../../modules/investor-portfolio/types";
import { selectTxAdditionalData } from "../../../../modules/tx/sender/selectors";
import { selectEthereumAddressWithChecksum } from "../../../../modules/web3/selectors";
import { appConnect } from "../../../../store";
import { EthereumAddressWithChecksum } from "../../../../types";
import { withParams } from "../../../../utils/withParams";
import { Button } from "../../../shared/buttons";
import { ExternalLink } from "../../../shared/links";
import { Heading } from "../../../shared/modals/Heading";
import { Money, selectCurrencyCode } from "../../../shared/Money";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";

interface IStateProps {
  tokensDisbursal: ITokenDisbursal[];
  walletAddress: EthereumAddressWithChecksum;
}

interface IDispatchProps {
  onAccept: () => void;
}

type TComponentProps = IStateProps & IDispatchProps;

const InvestorAcceptPayoutSummaryLayout: React.FunctionComponent<TComponentProps> = ({
  walletAddress,
  tokensDisbursal,
  onAccept,
}) => {
  return (
    <Container>
      <Heading className="mb-4">
        <FormattedMessage id="investor-payout.accept.summary.title" />
      </Heading>

      <p className="mb-3">
        {tokensDisbursal.length === 1 ? (
          <FormattedMessage
            id="investor-payout.accept.summary.single.description"
            values={{ token: selectCurrencyCode(tokensDisbursal[0].token) }}
          />
        ) : (
          <FormattedMessage id="investor-payout.accept.summary.combined.description" />
        )}
      </p>
      <InfoList className="mb-4">
        {tokensDisbursal.map(disbursal => (
          <InfoRow
            data-test-id={`investor-payout.accept-summary.${disbursal.token}-total-payout`}
            key={disbursal.token}
            caption={
              <FormattedMessage
                id="investor-payout.accept.summary.total-payout"
                values={{ token: selectCurrencyCode(disbursal.token) }}
              />
            }
            value={<Money value={disbursal.amountToBeClaimed} currency={disbursal.token} />}
          />
        ))}
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
    tokensDisbursal: selectTxAdditionalData(state),
  }),
  dispatchToProps: d => ({
    onAccept: () => d(actions.txSender.txSenderAccept()),
  }),
})(InvestorAcceptPayoutSummaryLayout);

export { InvestorAcceptPayoutSummary, InvestorAcceptPayoutSummaryLayout };
