import * as React from "react";

import { TBlETOWithInvestorTicket } from "../../modules/investor-portfolio/interfaces/interfaces";
import { IBlTokenDisbursal } from "../../modules/investor-portfolio/interfaces/TokenDisbursal";
import { AssetPortfolio } from "./AssetPortfolio";
import { PortfolioMyAssets } from "./PortfolioMyAssets";
import { PortfolioReservedAssets } from "./PortfolioReservedAssets";

import * as styles from "./PortfolioLayout.module.scss";

export type TPortfolioLayoutProps = {
  myAssets: TBlETOWithInvestorTicket[];
  walletAddress: string;
  pendingAssets: TBlETOWithInvestorTicket[];
  isRetailEto: boolean;
  tokensDisbursal: ReadonlyArray<IBlTokenDisbursal> | undefined;
  isVerifiedInvestor: boolean;
};

const PortfolioLayout: React.FunctionComponent<TPortfolioLayoutProps> = ({
  pendingAssets,
  walletAddress,
  isRetailEto,
  tokensDisbursal,
  isVerifiedInvestor,
}) => (
  <section className={styles.portfolio} data-test-id="portfolio-layout">
    {process.env.NF_ASSETS_PORTFOLIO_COMPONENT_VISIBLE === "1" && (
      <AssetPortfolio tokensDisbursal={tokensDisbursal} isVerifiedInvestor={isVerifiedInvestor} />
    )}

    <PortfolioReservedAssets pendingAssets={pendingAssets} />
    <PortfolioMyAssets isRetailEto={isRetailEto} walletAddress={walletAddress} />
  </section>
);

export { PortfolioLayout };
