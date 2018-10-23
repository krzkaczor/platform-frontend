import * as cn from "classnames";
import { keyBy } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { compose } from "recompose";

import { CounterWidget, InvestWidget, TagsWidget, TokenSymbolWidget } from ".";
import { selectIsAuthorized } from "../../../../modules/auth/selectors";
import { ETOStateOnChain, TEtoWithCompanyAndContract } from "../../../../modules/public-etos/types";
import { appConnect } from "../../../../store";
import { CommonHtmlProps } from "../../../../types";
import { withParams } from "../../../../utils/withParams";
import { appRoutes } from "../../../appRoutes";
import { ETOState } from "../../../shared/ETOState";
import { ECurrencySymbol, EMoneyFormat, Money } from "../../../shared/Money";
import { InvestmentAmount } from "../../shared/InvestmentAmount";
import { LoggedInCampaigning, LoggedOutCampaigning } from "./CampaigningWidget";
import { ClaimWidget, RefundWidget } from "./ClaimRefundWidget";
import { IWithIsEligibleToPreEto, withIsEligibleToPreEto } from "./withIsEligibleToPreEto";

import * as styles from "./EtoOverviewStatus.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
}

interface IStatusOfEto {
  previewCode: string;
}

interface IStateProps {
  isAuthorized: boolean;
}

const StatusOfEto: React.SFC<IStatusOfEto> = ({ previewCode }) => {
  return (
    <div className={styles.statusOfEto}>
      <span className={styles.title}>
        <FormattedMessage id="shared-component.eto-overview.status-of-eto" />
      </span>
      <ETOState previewCode={previewCode} />
    </div>
  );
};

const PoweredByNeufund = () => {
  return (
    <div className={styles.poweredByNeufund}>
      <div className={styles.powered}>Powered by</div>
      <div className={styles.neufund}>NEUFUND</div>
    </div>
  );
};

const EtoStatusManager = ({
  eto,
  isAuthorized,
  isEligibleToPreEto,
}: IExternalProps & IStateProps & IWithIsEligibleToPreEto) => {
  // It's possible for contract to be undefined if eto is not on chain yet
  const timedState = eto.contract ? eto.contract.timedState : ETOStateOnChain.Setup;

  switch (timedState) {
    case ETOStateOnChain.Setup: {
      if (isAuthorized) {
        if (eto.isBookbuilding) {
          return (
            <LoggedInCampaigning
              maxPledge={eto.maxTicketEur || 0}
              minPledge={eto.minTicketEur || 0}
              etoId={eto.etoId}
              investorsLimit={eto.maxPledges || 0}
            />
          );
        } else if (
          eto.contract &&
          eto.contract.startOfStates[ETOStateOnChain.Whitelist]! > new Date()
        ) {
          return (
            <CounterWidget
              endDate={
                eto.contract.startOfStates[
                  isEligibleToPreEto ? ETOStateOnChain.Whitelist : ETOStateOnChain.Public
                ]!
              }
              stage={isEligibleToPreEto ? "PRE-ETO" : "ETO"}
            />
          );
        } else {
          return <div className={styles.quote}>{eto.company.keyQuoteFounder}</div>;
        }
      } else {
        return <LoggedOutCampaigning />;
      }
    }
    case ETOStateOnChain.Whitelist: {
      if (isEligibleToPreEto) {
        return (
          <InvestWidget
            raisedTokens={eto.contract!.totalInvestment.totalTokensInt.toNumber()}
            investorsBacked={eto.contract!.totalInvestment.totalInvestors.toNumber()}
            tokensGoal={(eto.newSharesToIssue || 1) * (eto.equityTokensPerShare || 1)}
            etoId={eto.etoId}
          />
        );
      } else {
        return (
          <CounterWidget
            endDate={eto.contract!.startOfStates[ETOStateOnChain.Public]!}
            stage="ETO"
          />
        );
      }
    }

    case ETOStateOnChain.Public: {
      return (
        <InvestWidget
          raisedTokens={eto.contract!.totalInvestment.totalTokensInt.toNumber()}
          investorsBacked={eto.contract!.totalInvestment.totalInvestors.toNumber()}
          tokensGoal={(eto.newSharesToIssue || 1) * (eto.equityTokensPerShare || 1)}
          etoId={eto.etoId}
        />
      );
    }

    case ETOStateOnChain.Claim:
    case ETOStateOnChain.Signing:
    case ETOStateOnChain.Payout: {
      return (
        <ClaimWidget
          etoId={eto.etoId}
          tokenName={eto.equityTokenName || ""}
          totalInvestors={eto.contract!.totalInvestment.totalInvestors.toNumber()}
          totalEquivEurUlps={eto.contract!.totalInvestment.totalEquivEurUlps}
          timedState={timedState}
        />
      );
    }

    case ETOStateOnChain.Refund: {
      return <RefundWidget etoId={eto.etoId} timedState={timedState} />;
    }

    default:
      throw new Error(`State (${timedState}) is not known. Please provide implementation.`);
  }
};

const EtoOverviewStatusLayout: React.SFC<
  IExternalProps & CommonHtmlProps & IWithIsEligibleToPreEto & IStateProps
> = ({ eto, className, isAuthorized, isEligibleToPreEto }) => {
  const smartContractOnChain = !!eto.contract;

  const documentsByType = keyBy(eto.documents, document => document.documentType);

  return (
    <div
      className={cn(styles.etoOverviewStatus, className)}
      data-test-id={`eto-overview-${eto.etoId}`}
    >
      <div className={styles.overviewWrapper}>
        <div className={styles.statusWrapper}>
          <StatusOfEto previewCode={eto.previewCode} />
          <Link to={withParams(appRoutes.etoPublicView, { etoId: eto.etoId })}>
            <TokenSymbolWidget
              tokenImage={{
                alt: eto.equityTokenName || "",
                srcSet: { "1x": eto.equityTokenImage || "" },
              }}
              tokenName={eto.equityTokenName}
              tokenSymbol={eto.equityTokenSymbol || ""}
            />
          </Link>

          <PoweredByNeufund />
        </div>

        <div className={styles.divider} />

        <div className={styles.tagsWrapper}>
          <TagsWidget
            etoId={eto.etoId}
            termSheet={documentsByType["termsheet_template"]}
            prospectusApproved={documentsByType["approved_prospectus"]}
            smartContractOnchain={smartContractOnChain}
          />
        </div>

        <div className={styles.divider} />

        <div className={styles.groupWrapper}>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.pre-money-valuation" />
            </span>
            <span className={styles.value}>
              <Money
                value={eto.preMoneyValuationEur}
                currency="eur"
                format={EMoneyFormat.FLOAT}
                currencySymbol={ECurrencySymbol.SYMBOL}
              />
            </span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.investment-amount" />
            </span>
            <span className={styles.value}>
              <InvestmentAmount
                newSharesToIssue={eto.newSharesToIssue}
                newSharesToIssueInFixedSlots={eto.newSharesToIssueInFixedSlots}
                newSharesToIssueInWhitelist={eto.newSharesToIssueInWhitelist}
                fixedSlotsMaximumDiscountFraction={eto.fixedSlotsMaximumDiscountFraction}
                whitelistDiscountFraction={eto.whitelistDiscountFraction}
                existingCompanyShares={eto.existingCompanyShares}
                preMoneyValuationEur={eto.preMoneyValuationEur}
                minimumNewSharesToIssue={eto.minimumNewSharesToIssue}
              />
            </span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.new-shares-generated" />
            </span>
            <span className={styles.value}>{eto.newSharesToIssue}</span>
          </div>
          <div className={styles.group}>
            <span className={styles.label}>
              <FormattedMessage id="shared-component.eto-overview-status.equity-token-price" />
            </span>
            <span className={styles.value}>
              €{" "}
              {(
                (eto.preMoneyValuationEur || 0) /
                (eto.existingCompanyShares || 1) /
                (eto.equityTokensPerShare || 1)
              ).toFixed(4)}
            </span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.stageContentWrapper}>
          <EtoStatusManager
            eto={eto}
            isAuthorized={isAuthorized}
            isEligibleToPreEto={isEligibleToPreEto}
          />
        </div>
      </div>
    </div>
  );
};

export const EtoOverviewStatus = compose<
  IExternalProps & CommonHtmlProps & IWithIsEligibleToPreEto & IStateProps,
  IExternalProps & CommonHtmlProps
>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: state => ({
      isAuthorized: selectIsAuthorized(state.auth),
    }),
  }),
  withIsEligibleToPreEto,
)(EtoOverviewStatusLayout);
