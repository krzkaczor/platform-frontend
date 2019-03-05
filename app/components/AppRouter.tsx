import * as queryString from "query-string";
import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { IS_CYPRESS } from "../config/constants";
import { SwitchConnected } from "../utils/connectedRouting";
import { appRoutes } from "./appRoutes";
import { Dashboard } from "./dashboard/Dashboard";
import { Documents } from "./documents/Documents";
import { MigrationFromLink } from "./edge-cases/MigrationFromLink";
import { UnlockWalletFundsFromLink } from "./edge-cases/UnlockWalletFundsFromLink";
import { EtoDashboard } from "./eto/EtoDashboard";
import { EtoIssuerView } from "./eto/EtoIssuerView";
import { EtoPublicView } from "./eto/EtoPublicView";
import { EtoPublicViewByContractId } from "./eto/EtoPublicViewByContractId";
import { EtoWidgetView } from "./eto/EtoWidgetView";
import { EtoRegister } from "./eto/registration/Start";
import { Kyc } from "./kyc/Kyc";
import { Landing } from "./landing/Landing";
import { LandingEto } from "./landing/LandingEto";
import { Portfolio } from "./portfolio";
import { BackupSeed } from "./settings/backup-seed/BackupSeed";
import { EmailVerify } from "./settings/EmailVerify";
import { profileRoutes } from "./settings/routes";
import { Settings } from "./settings/Settings";
import { OnlyAuthorizedRoute } from "./shared/routing/OnlyAuthorizedRoute";
import { OnlyPublicRoute } from "./shared/routing/OnlyPublicRoute";
import { TestCriticalError } from "./testing/critical-error/TestCriticalError";
import { e2eRoutes } from "./testing/e2eRoutes";
import { TestEmbededWidget } from "./testing/embeded-widget/TestEmbededWidget";
import { WalletRecoverMain } from "./wallet-selector/wallet-recover/WalletRecoverMain";
import { WalletSelector } from "./wallet-selector/WalletSelector";
import { Wallet } from "./wallet/Wallet";

export const AppRouter: React.FunctionComponent = () => (
  <SwitchConnected>
    <Route
      path={appRoutes.etoPublicView}
      render={({ match }) => <EtoPublicView previewCode={match.params.previewCode} />}
      exact
    />
    <Route
      path={appRoutes.etoPublicViewById}
      render={({ match }) => <EtoPublicViewByContractId etoId={match.params.etoId} />}
      exact
    />
    <Route
      path={appRoutes.etoWidgetView}
      render={({ match }) => <EtoWidgetView previewCode={match.params.previewCode} />}
      exact
    />
    <OnlyPublicRoute path={appRoutes.root} component={Landing} exact />
    <OnlyPublicRoute path={appRoutes.register} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.login} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.restore} component={WalletRecoverMain} />
    {process.env.NF_ISSUERS_ENABLED === "1" && [
      <OnlyPublicRoute
        key={appRoutes.etoLanding}
        path={appRoutes.etoLanding}
        component={LandingEto}
      />,
      <OnlyPublicRoute
        key={appRoutes.registerEto}
        path={appRoutes.registerEto}
        component={EtoSecretProtectedWalletSelector}
      />,
      <OnlyPublicRoute
        key={appRoutes.loginEto}
        path={appRoutes.loginEto}
        component={EtoSecretProtectedWalletSelector}
      />,
      <OnlyPublicRoute
        key={appRoutes.restoreEto}
        path={appRoutes.restoreEto}
        component={WalletRecoverMain}
      />,
    ]}
    {/* only investors routes */}
    {process.env.NF_PORTFOLIO_PAGE_VISIBLE === "1" && (
      <OnlyAuthorizedRoute path={appRoutes.portfolio} investorComponent={Portfolio} />
    )}
    <OnlyAuthorizedRoute path={appRoutes.icbmMigration} investorComponent={MigrationFromLink} />
    <OnlyAuthorizedRoute
      path={appRoutes.walletUnlock}
      investorComponent={UnlockWalletFundsFromLink}
    />

    {/* only issuer routes */}
    <OnlyAuthorizedRoute path={appRoutes.documents} issuerComponent={Documents} />
    <OnlyAuthorizedRoute path={appRoutes.etoRegister} issuerComponent={EtoRegister} />
    <OnlyAuthorizedRoute path={appRoutes.etoIssuerView} issuerComponent={EtoIssuerView} exact />
    {/* common routes for both investors and issuers */}
    <OnlyAuthorizedRoute
      path={appRoutes.wallet}
      investorComponent={Wallet}
      issuerComponent={Wallet}
    />
    <OnlyAuthorizedRoute
      path={appRoutes.dashboard}
      investorComponent={Dashboard}
      issuerComponent={EtoDashboard}
      exact
    />
    <OnlyAuthorizedRoute
      path={appRoutes.verify}
      investorComponent={EmailVerify}
      issuerComponent={EmailVerify}
    />
    <OnlyAuthorizedRoute
      path={appRoutes.profile}
      investorComponent={Settings}
      issuerComponent={Settings}
      exact
    />
    <OnlyAuthorizedRoute
      path={profileRoutes.seedBackup}
      investorComponent={BackupSeed}
      issuerComponent={BackupSeed}
      exact
    />
    <OnlyAuthorizedRoute path={appRoutes.kyc} investorComponent={Kyc} issuerComponent={Kyc} />

    {/*Routes used only in E2E tests*/}
    {IS_CYPRESS && [
      <Route
        key={1}
        path={e2eRoutes.embededWidget}
        render={({ match }) => <TestEmbededWidget etoId={match.params.etoId} />}
        exact
      />,
      <Route key={2} path={e2eRoutes.criticalError} render={() => <TestCriticalError />} exact />,
    ]}
    <Redirect to={appRoutes.root} />
  </SwitchConnected>
);

const SecretProtected = (Component: any) =>
  class extends React.Component<any> {
    shouldComponentUpdate(): boolean {
      return false;
    }

    render(): React.ReactNode {
      const props = this.props;
      const params = queryString.parse(window.location.search);

      if (!process.env.NF_ISSUERS_SECRET || params.etoSecret === process.env.NF_ISSUERS_SECRET) {
        return <Component {...props} />;
      }

      return <Redirect to={appRoutes.root} />;
    }
  };
const EtoSecretProtectedWalletSelector = SecretProtected(WalletSelector);
