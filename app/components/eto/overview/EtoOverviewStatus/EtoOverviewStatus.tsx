import * as cn from "classnames";
import { push } from "connected-react-router";
import { keyBy } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { compose } from "recompose";

import { CounterWidget, TagsWidget } from ".";
import { getShareAndTokenPrice } from "../../../../lib/api/eto/EtoUtils";
import { selectIsAuthorized } from "../../../../modules/auth/selectors";
import { EEtoDocumentType } from "../../../../modules/eto-documents/interfaces";
import {
  selectInitialMaxCapExceeded,
  selectIsEligibleToPreEto,
} from "../../../../modules/investor-portfolio/selectors";
import {
  EETOStateOnChain,
  TBlEtoWithCompanyAndContract,
} from "../../../../modules/public-etos/interfaces/interfaces";
import { selectEtoOnChainStateById } from "../../../../modules/public-etos/selectors";
import { routingActions } from "../../../../modules/routing/actions";
import { appConnect } from "../../../../store";
import { CommonHtmlProps } from "../../../../types";
import { formatFlexiPrecision } from "../../../../utils/Number.utils";
import { withParams } from "../../../../utils/withParams";
import { appRoutes } from "../../../appRoutes";
import { ETOState } from "../../../shared/ETOState";
import { ECurrency, ECurrencySymbol, EMoneyFormat, Money } from "../../../shared/Money";
import { NumberFormat } from "../../../shared/NumberFormat";
import { EtoWidgetContext } from "../../EtoWidgetView";
import { InvestmentAmount } from "../../shared/InvestmentAmount";
import { CampaigningActivatedWidget } from "./CampaigningWidget";
import { ClaimWidget, RefundWidget } from "./ClaimRefundWidget";
import { EtoMaxCapExceededWidget } from "./EtoMaxCapExceeded";
import { InvestmentWidget } from "./InvestmentWidget";
import { RegisterNowWidget } from "./RegisterNowWidget";
import { TokenSymbolWidget } from "./TokenSymbolWidget";

import BigNumber from "bignumber.js";
import * as styles from "./EtoOverviewStatus.module.scss";

interface IExternalProps {
  eto: TBlEtoWithCompanyAndContract;
  publicView?: boolean;
}

interface IStatusOfEto {
  previewCode: string;
}

interface IDispatchProps {
  navigateToEto: () => void;
  openInNewWindow: () => void;
}

interface IStateProps {
  isAuthorized: boolean;
  isEligibleToPreEto: boolean;
  isPreEto?: boolean;
  maxCapExceeded: boolean;
}

const StatusOfEto: React.FunctionComponent<IStatusOfEto> = ({ previewCode }) => {
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
    <div className={styles.poweredByNeufund} data-test-id="eto-overview-powered-by">
      <div className={styles.powered}>Powered by</div>
      <Link className={styles.neufund} target={"_blank"} to={"https://neufund.org"}>
        NEUFUND
      </Link>
    </div>
  );
};

const EtoStatusManager = ({
  eto,
  isAuthorized,
  isEligibleToPreEto,
  maxCapExceeded,
}: IExternalProps & IStateProps) => {
  // It's possible for contract to be undefined if eto is not on chain yet
  const timedState = eto.contract ? eto.contract.timedState : EETOStateOnChain.Setup;
  const isEtoActive =
    (isEligibleToPreEto && timedState === EETOStateOnChain.Whitelist) ||
    timedState === EETOStateOnChain.Public;

  if (maxCapExceeded && isEtoActive) {
    return <EtoMaxCapExceededWidget eto={eto} />;
  }

  switch (timedState) {
    case EETOStateOnChain.Setup: {
      if (isAuthorized) {
        const nextState = isEligibleToPreEto ? EETOStateOnChain.Whitelist : EETOStateOnChain.Public;
        const nextStateStartDate = eto.contract ? eto.contract.startOfStates[nextState] : undefined;

        return (
          <CampaigningActivatedWidget
            maxPledge={eto.maxTicketEur}
            minPledge={eto.minTicketEur}
            etoId={eto.etoId}
            investorsLimit={eto.maxPledges}
            nextState={nextState}
            nextStateStartDate={nextStateStartDate}
            isActive={eto.isBookbuilding}
            keyQuoteFounder={eto.company.keyQuoteFounder}
          />
        );
      } else {
        return <RegisterNowWidget />;
      }
    }
    case EETOStateOnChain.Whitelist: {
      if (isEligibleToPreEto) {
        return <InvestmentWidget eto={eto} />;
      } else {
        return (
          <CounterWidget
            endDate={eto.contract!.startOfStates[EETOStateOnChain.Public]!}
            state={EETOStateOnChain.Public}
          />
        );
      }
    }

    case EETOStateOnChain.Public: {
      return <InvestmentWidget eto={eto} />;
    }

    case EETOStateOnChain.Claim:
    case EETOStateOnChain.Signing:
    case EETOStateOnChain.Payout: {
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

    case EETOStateOnChain.Refund: {
      return <RefundWidget etoId={eto.etoId} timedState={timedState} />;
    }

    default:
      throw new Error(`State (${timedState}) is not known. Please provide implementation.`);
  }
};

function applyDiscountToPrice(price: BigNumber, discountFraction: BigNumber): BigNumber {
  return price.mul(new BigNumber(1).minus(discountFraction));
}

function onEtoNavigationClick(
  navigate: () => void,
  openInNewWindow: (() => void) | undefined,
): (event: React.MouseEvent<HTMLDivElement>) => void {
  return function({ target, currentTarget }: React.MouseEvent<HTMLDivElement>): void {
    if (target === currentTarget) {
      if (openInNewWindow) {
        openInNewWindow();
        return;
      }
      navigate();
    }
  };
}

const EtoOverviewStatusLayout: React.FunctionComponent<
  IExternalProps & CommonHtmlProps & IStateProps & IDispatchProps
> = ({
  eto,
  className,
  isAuthorized,
  isEligibleToPreEto,
  isPreEto,
  maxCapExceeded,
  navigateToEto,
  publicView,
  openInNewWindow,
}) => {
  const smartContractOnChain = !!eto.contract;

  const documentsByType = keyBy(eto.documents, document => document.documentType);

  let { tokenPrice } = getShareAndTokenPrice(eto);

  const showWhitelistDiscount = Boolean(
    eto.whitelistDiscountFraction && isEligibleToPreEto && isPreEto,
  );
  const showPublicDiscount = Boolean(!showWhitelistDiscount && eto.publicDiscountFraction);
  if (showWhitelistDiscount) {
    tokenPrice = applyDiscountToPrice(tokenPrice, eto.whitelistDiscountFraction);
  } else if (showPublicDiscount) {
    tokenPrice = applyDiscountToPrice(tokenPrice, eto.publicDiscountFraction);
  }

  return (
    <EtoWidgetContext.Consumer>
      {previewCode => (
        <div
          className={cn(styles.etoOverviewStatus, className)}
          data-test-id={`eto-overview-${eto.etoId}`}
        >
          <StatusOfEto previewCode={eto.previewCode} />
          <div
            className={styles.overviewWrapper}
            onClick={onEtoNavigationClick(navigateToEto, previewCode ? openInNewWindow : undefined)}
          >
            <div
              className={cn(styles.statusWrapper, styles.breakSm)}
              onClick={onEtoNavigationClick(
                navigateToEto,
                previewCode ? openInNewWindow : undefined,
              )}
            >
              <Link
                to={withParams(appRoutes.etoPublicView, { previewCode: eto.previewCode })}
                target={previewCode ? "_blank" : ""}
                data-test-id="eto-overview-status-token"
              >
                <TokenSymbolWidget
                  brandName={eto.company.brandName}
                  tokenImage={{
                    alt: eto.equityTokenName || "",
                    srcSet: { "1x": eto.equityTokenImage || "" },
                  }}
                  tokenName={eto.equityTokenName}
                  tokenSymbol={eto.equityTokenSymbol || ""}
                />
              </Link>
            </div>

            <div className={cn(styles.divider, "d-none", "d-lg-block")} />

            <div className={styles.tagsWrapper}>
              <TagsWidget
                etoId={eto.etoId}
                allowRetailEto={eto.allowRetailInvestors}
                termSheet={documentsByType[EEtoDocumentType.SIGNED_TERMSHEET]}
                prospectusApproved={
                  documentsByType[EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT]
                }
                smartContractOnchain={smartContractOnChain}
                innerClass={styles.tagItem}
              />
            </div>

            <div
              className={cn(
                styles.divider,
                "d-md-none",
                "d-lg-block",
                "d-xl-block",
                styles.breakSm,
              )}
            />

            <div className={cn(styles.groupWrapper, styles.breakSm)}>
              <div className={styles.groupTable}>
                <div className={styles.group}>
                  <span className={styles.label}>
                    <FormattedMessage id="shared-component.eto-overview-status.key-investment-terms" />
                    {":"}
                  </span>
                </div>
                <div className={styles.group}>
                  <span className={styles.label}>
                    <FormattedMessage id="shared-component.eto-overview-status.pre-money-valuation" />
                  </span>
                  <span className={styles.value}>
                    <Money
                      value={eto.preMoneyValuationEur}
                      currency={ECurrency.EUR}
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
                    <InvestmentAmount etoData={eto} />
                  </span>
                </div>
                <div className={styles.group}>
                  <span className={styles.label}>
                    <FormattedMessage id="shared-component.eto-overview-status.new-shares-generated" />
                  </span>
                  <span className={styles.value}>
                    <NumberFormat value={eto.newSharesToIssue} />
                  </span>
                </div>
                <div className={styles.group}>
                  <span className={styles.label}>
                    <FormattedMessage id="shared-component.eto-overview-status.equity-token-price" />
                  </span>
                  <span className={styles.value}>
                    <Money
                      value={formatFlexiPrecision(tokenPrice, 8)}
                      currency={ECurrency.EUR}
                      format={EMoneyFormat.FLOAT}
                      currencySymbol={ECurrencySymbol.SYMBOL}
                    />
                    {showWhitelistDiscount && (
                      <>
                        {" ("}
                        <FormattedMessage
                          id="shared-component.eto-overview-status.included-discount-percentage"
                          values={{ percentage: eto.whitelistDiscountFraction.mul(100).toNumber() }}
                        />
                        {")"}
                      </>
                    )}
                    {showPublicDiscount && (
                      <>
                        {" ("}
                        <FormattedMessage
                          id="shared-component.eto-overview-status.included-discount-percentage"
                          values={{ percentage: eto.publicDiscountFraction.mul(100).toNumber() }}
                        />
                        {")"}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className={cn(styles.divider, styles.breakMd)} />

            <div className={cn(styles.stageContentWrapper, styles.breakMd)}>
              <EtoStatusManager
                eto={eto}
                isAuthorized={isAuthorized}
                isEligibleToPreEto={isEligibleToPreEto}
                maxCapExceeded={maxCapExceeded}
              />
            </div>
          </div>
          {previewCode ? (
            <PoweredByNeufund />
          ) : !publicView ? (
            <Link
              className={styles.moreDetails}
              to={withParams(appRoutes.etoPublicView, { previewCode: eto.previewCode })}
            >
              <FormattedMessage id="shared-component.eto-overview.more-details" />
            </Link>
          ) : null}
        </div>
      )}
    </EtoWidgetContext.Consumer>
  );
};

const EtoOverviewStatus = compose<
  IExternalProps & CommonHtmlProps & IStateProps & IDispatchProps,
  IExternalProps & CommonHtmlProps
>(
  appConnect<IStateProps, IDispatchProps, IExternalProps>({
    stateToProps: (state, props) => ({
      isAuthorized: selectIsAuthorized(state.auth),
      isEligibleToPreEto: selectIsEligibleToPreEto(state, props.eto.etoId),
      isPreEto: selectEtoOnChainStateById(state, props.eto.etoId) === EETOStateOnChain.Whitelist,
      maxCapExceeded: selectInitialMaxCapExceeded(state, props.eto.etoId),
    }),
    dispatchToProps: (dispatch, { eto }) => ({
      navigateToEto: () =>
        dispatch(push(withParams(appRoutes.etoPublicView, { previewCode: eto.previewCode }))),
      openInNewWindow: () =>
        dispatch(
          routingActions.openInNewWindow(
            withParams(appRoutes.etoPublicView, { previewCode: eto.previewCode }),
          ),
        ),
    }),
  }),
)(EtoOverviewStatusLayout);

export { EtoOverviewStatusLayout, EtoOverviewStatus };
