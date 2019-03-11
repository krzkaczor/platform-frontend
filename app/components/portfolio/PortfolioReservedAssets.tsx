import * as cn from "classnames";
import * as React from "react";
import { FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

import { TETOWithInvestorTicket } from "../../modules/investor-portfolio/types";
import { getNeuReward } from "../../modules/investor-portfolio/utils";
import { EETOStateOnChain } from "../../modules/public-etos/types";
import { withParams } from "../../utils/withParams";
import { appRoutes } from "../appRoutes";
import { EProjectStatusSize, ETOState } from "../shared/ETOState";
import { Heading } from "../shared/Heading";
import { ECurrency, ECurrencySymbol, EMoneyFormat, Money } from "../shared/Money";
import { NumberFormat } from "../shared/NumberFormat";
import { ENewTableCellLayout, NewTable, NewTableRow } from "../shared/table";
import { PortfolioAssetAction } from "./PortfolioAssetAction";

import * as neuIcon from "../../assets/img/neu_icon.svg";
import * as styles from "./PortfolioLayout.module.scss";

interface IExternalProps {
  pendingAssets: TETOWithInvestorTicket[];
}

const PortfolioReservedAssets: React.FunctionComponent<IExternalProps> = ({ pendingAssets }) => (
  <>
    <Heading
      level={3}
      decorator={false}
      className="mb-4"
      description={<FormattedMessage id="portfolio.section.reserved-assets.description" />}
    >
      <FormattedMessage id="portfolio.section.reserved-assets.title" />
    </Heading>

    <Row>
      <Col>
        <NewTable
          placeholder={
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.placeholder" />
          }
          titles={[
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.token" />,
            "",
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.balance" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.value-eur" />,
            <FormattedMessage id="portfolio.section.reserved-assets.table.header.price-eur" />,
            <>
              <img src={neuIcon} alt="neu token" className={cn("mr-2", styles.tokenSmall)} />
              <FormattedMessage id="portfolio.section.reserved-assets.table.header.neu-reward" />
            </>,
            {
              title: (
                <FormattedMessage id="portfolio.section.reserved-assets.table.header.eto-status" />
              ),
              width: "20%",
            },
          ]}
        >
          {pendingAssets.map(
            ({
              equityTokenImage,
              equityTokenName,
              equityTokenSymbol,
              investorTicket,
              contract,
              etoId,
              previewCode,
            }) => {
              const timedState = contract!.timedState;
              const isWhitelistedOrPublic =
                timedState === EETOStateOnChain.Whitelist || timedState === EETOStateOnChain.Public;

              return (
                <NewTableRow
                  key={etoId}
                  data-test-id={`portfolio-reserved-asset-${etoId}`}
                  cellLayout={ENewTableCellLayout.MIDDLE}
                >
                  <>
                    <img src={equityTokenImage} alt="" className={cn("mr-2", styles.token)} />
                    <span className={"d-inline-block"}>
                      <span
                        className={styles.tokenName}
                        data-test-id="portfolio-reserved-asset-token-name"
                      >
                        {equityTokenName} ({equityTokenSymbol})
                      </span>
                    </span>
                  </>
                  <Link
                    to={withParams(appRoutes.etoPublicView, { previewCode })}
                    data-test-id="portfolio-reserved-assets-view-profile"
                  >
                    <FormattedMessage id="portfolio.section.reserved-assets.view-profile" />
                  </Link>
                  <NumberFormat
                    data-test-id="portfolio-reserved-asset-token-balance"
                    value={investorTicket.equityTokenInt}
                  />

                  <Money
                    data-test-id="portfolio-reserved-asset-value"
                    value={getNeuReward(investorTicket.equityTokenInt, investorTicket.equivEurUlps)}
                    currency={ECurrency.EUR}
                    format={EMoneyFormat.FLOAT}
                    currencySymbol={ECurrencySymbol.SYMBOL}
                  />
                  <Money
                    data-test-id="portfolio-reserved-asset-token-price"
                    value={investorTicket.rewardNmkUlps.toString()}
                    currency={ECurrency.NEU}
                    currencySymbol={ECurrencySymbol.NONE}
                  />
                  <span data-test-id="portfolio-reserved-asset-token-status">
                    {isWhitelistedOrPublic ? (
                      <span className={"text-uppercase"}>
                        <FormattedMessage
                          id="shared-component.eto-overview.invest.ends-in"
                          values={{
                            endsIn: (
                              <FormattedRelative
                                value={contract!.startOfStates[EETOStateOnChain.Signing]!}
                                style="numeric"
                              />
                            ),
                          }}
                        />
                      </span>
                    ) : (
                      <ETOState previewCode={previewCode} size={EProjectStatusSize.SMALL} />
                    )}
                  </span>
                  <PortfolioAssetAction state={timedState} etoId={etoId} />
                </NewTableRow>
              );
            },
          )}
        </NewTable>
      </Col>
    </Row>
  </>
);

export { PortfolioReservedAssets };
