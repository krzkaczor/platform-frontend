import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../modules/actions";
import * as tokenDisbursalInterfaces from "../../modules/investor-portfolio/interfaces/TokenDisbursal";
import { appConnect } from "../../store";
import { CommonHtmlProps } from "../../types";
import { Button, ButtonSize, EButtonLayout } from "../shared/buttons";
import { LoadingIndicator } from "../shared/loading-indicator";
import { ECurrency, ETheme, Money, selectCurrencyCode } from "../shared/Money";
import { Panel } from "../shared/Panel";
import { SectionHeader } from "../shared/SectionHeader";
import { NewTable, NewTableRow } from "../shared/table";

import * as ethIcon from "../../assets/img/eth_icon.svg";
import * as neuIcon from "../../assets/img/neu_icon.svg";
import * as nEurIcon from "../../assets/img/nEUR_icon.svg";
import { convert, convertInArray } from "../eto/utils";

interface IExternalProps {
  tokensDisbursal: ReadonlyArray<tokenDisbursalInterfaces.IBlTokenDisbursal> | undefined;
  isVerifiedInvestor: boolean;
}

interface ILayoutProps {
  tokensDisbursal: ReadonlyArray<tokenDisbursalInterfaces.IBlTokenDisbursal>;
  isVerifiedInvestor: boolean;
}

interface IDispatchToProps {
  redistributePayout: (tokenDisbursal: tokenDisbursalInterfaces.IBlTokenDisbursal) => void;
  acceptPayout: (tokenDisbursal: tokenDisbursalInterfaces.IBlTokenDisbursal) => void;
  acceptCombinedPayout: (
    tokensDisbursal: ReadonlyArray<tokenDisbursalInterfaces.IBlTokenDisbursal>,
  ) => void;
}

// TODO: move as a reusable component
const CurrencyIcon: React.FunctionComponent<{ currency: ECurrency } & CommonHtmlProps> = ({
  currency,
  className,
}) => {
  switch (currency) {
    case ECurrency.EUR_TOKEN:
      return (
        <img src={nEurIcon} alt={`${selectCurrencyCode(currency)} token`} className={className} />
      );
    case ECurrency.ETH:
      return (
        <img src={ethIcon} alt={`${selectCurrencyCode(currency)} token`} className={className} />
      );
    default:
      throw new Error(`Icon for currency ${currency} not found`);
  }
};

const AssetPortfolioLayoutNoPayouts: React.FunctionComponent = () => (
  <SectionHeader
    data-test-id="asset-portfolio.no-payouts"
    decorator={false}
    className="mb-4"
    description={<FormattedMessage id="portfolio.asset.payouts-from-neu.no-payouts" />}
  >
    <FormattedMessage id="portfolio.section.asset-portfolio.title" />
  </SectionHeader>
);

const AssetPortfolioLayout: React.FunctionComponent<ILayoutProps & IDispatchToProps> = ({
  tokensDisbursal,
  redistributePayout,
  acceptPayout,
  acceptCombinedPayout,
  isVerifiedInvestor,
}) => (
  <Row className="mb-4">
    <Col md={5} lg={4} sm={12}>
      <SectionHeader decorator={false} className="mb-4">
        <FormattedMessage id="portfolio.section.asset-portfolio.title" />
      </SectionHeader>

      <Panel>
        <p>
          <FormattedMessage
            id="portfolio.asset.amounts-to-claim"
            values={{
              amounts: (
                <>
                  {tokensDisbursal
                    .map(t => (
                      <Money
                        key={t.currency}
                        value={t.amountToBeClaimed}
                        currency={t.currency}
                        theme={ETheme.GREEN_BIG}
                      />
                    ))
                    // add + between nodes
                    .reduce<React.ReactNode[]>(
                      (p, c) => (p.length === 0 ? p.concat(c) : p.concat(" + ", c)),
                      [],
                    )}
                </>
              ),
            }}
          />
        </p>
        <p className="mb-0">
          <FormattedMessage id="portfolio.asset.amounts-to-claim-description" />
        </p>
      </Panel>
    </Col>
    <Col md={7} lg={8} sm={12} className="mt-4 mt-md-0">
      <SectionHeader decorator={neuIcon} className="mb-4">
        <FormattedMessage id="portfolio.asset.payouts-from-neu.title" />
      </SectionHeader>

      <NewTable
        titles={[
          "", // token icon
          <FormattedMessage id="portfolio.asset.payouts-from-neu.your-share" />,
          <FormattedMessage id="portfolio.asset.payouts-from-neu.total-payout" />,
          <FormattedMessage id="portfolio.asset.payouts-from-neu.claim-by" />,
          "", // reject payout
          "", // accept payout
        ]}
      >
        {tokensDisbursal.map(tokenDisbursal => (
          <NewTableRow
            key={tokenDisbursal.currency}
            data-test-id={`asset-portfolio.payout-${tokenDisbursal.currency}`}
          >
            <>
              <CurrencyIcon currency={tokenDisbursal.currency} className="mr-2" />
              {selectCurrencyCode(tokenDisbursal.currency)}
            </>
            <Money
              data-test-id={`asset-portfolio.payout.amount-to-be-claimed`}
              value={tokenDisbursal.amountToBeClaimed}
              currency={tokenDisbursal.currency}
              theme={ETheme.GREEN}
            />
            <Money value={tokenDisbursal.totalDisbursedAmount} currency={tokenDisbursal.currency} />
            <FormattedDate value={tokenDisbursal.timeToFirstDisbursalRecycle} />
            <Button
              disabled={!isVerifiedInvestor}
              data-test-id="asset-portfolio.payout.redistribute-payout"
              size={ButtonSize.SMALL}
              onClick={() => redistributePayout(tokenDisbursal)}
              layout={EButtonLayout.SECONDARY}
            >
              <FormattedMessage id="portfolio.asset.payouts-from-neu.redistribute-payout" />
            </Button>
            <Button
              disabled={!isVerifiedInvestor}
              data-test-id="asset-portfolio.payout.accept-payout"
              theme="green"
              size={ButtonSize.SMALL}
              onClick={() => acceptPayout(tokenDisbursal)}
              layout={EButtonLayout.SECONDARY}
            >
              <FormattedMessage id="portfolio.asset.payouts-from-neu.accept-payout" />
            </Button>
          </NewTableRow>
        ))}
        <NewTableRow>
          <></>
          <></>
          <></>
          <></>
          <></>
          <Button
            disabled={!isVerifiedInvestor}
            data-test-id="asset-portfolio.payout.accept-all-payouts"
            theme="green"
            size={ButtonSize.SMALL}
            onClick={() => acceptCombinedPayout(tokensDisbursal)}
            layout={EButtonLayout.SECONDARY}
          >
            <FormattedMessage id="portfolio.asset.payouts-from-neu.accept-all-payout" />
          </Button>
        </NewTableRow>
      </NewTable>
    </Col>
  </Row>
);

const AssetPortfolio = compose<ILayoutProps & IDispatchToProps, IExternalProps>(
  appConnect<{}, IDispatchToProps>({
    dispatchToProps: dispatch => ({
      redistributePayout: (tokenDisbursal: tokenDisbursalInterfaces.IBlTokenDisbursal) =>
        dispatch(
          actions.txTransactions.startInvestorPayoutRedistribute(
            convert(tokenDisbursal, tokenDisbursalInterfaces.blToStateConversionSpec),
          ),
        ),
      acceptPayout: (tokenDisbursal: tokenDisbursalInterfaces.IBlTokenDisbursal) =>
        dispatch(
          actions.txTransactions.startInvestorPayoutAccept([
            convert(tokenDisbursal, tokenDisbursalInterfaces.blToStateConversionSpec),
          ]),
        ),
      acceptCombinedPayout: (
        tokensDisbursal: ReadonlyArray<tokenDisbursalInterfaces.IBlTokenDisbursal>,
      ) =>
        dispatch(
          actions.txTransactions.startInvestorPayoutAccept(
            convertInArray(tokenDisbursalInterfaces.blToStateConversionSpec)(tokensDisbursal),
          ),
        ),
    }),
  }),
  // Loading
  branch<IExternalProps>(
    ({ tokensDisbursal }) => tokensDisbursal === undefined,
    renderComponent(LoadingIndicator),
  ),
  // No payouts
  branch<ILayoutProps>(
    ({ tokensDisbursal }) => tokensDisbursal.length === 0,
    renderComponent(AssetPortfolioLayoutNoPayouts),
  ),
)(AssetPortfolioLayout);

export { AssetPortfolio };
