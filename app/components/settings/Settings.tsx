import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { EKycRequestType, ERequestStatus } from "../../lib/api/KycApi.interfaces";
import { EUserType } from "../../lib/api/users/interfaces";
import { actions } from "../../modules/actions";
import { selectUserType } from "../../modules/auth/selectors";
import { selectKycRequestStatus, selectKycRequestType } from "../../modules/kyc/selectors";
import {
  selectIcbmWalletConnected,
  selectLockedWalletConnected,
} from "../../modules/wallet/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withMetaTags } from "../../utils/withMetaTags";
import { DashboardSection } from "../eto/shared/DashboardSection";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { GridBaseLayout, WidgetGridLayout } from "../shared/Layout";
import { SectionHeader } from "../shared/SectionHeader";
import { ChangeEmail } from "./change-email/ChangeEmail";
import { YourEthereumAddressWidget } from "./ethereum-address-widget/YourEthereumAddressWidget";
import { CheckYourICBMWalletWidget } from "./icbm-wallet-widget/CheckYourICBMWalletWidget";
import { LinkedBankAccountWidget } from "./linked-bank-account/LinkedBankAccountWidget";
import { PersonalAccountDetails } from "./personal-account-details/PersonalAccountDetails";
import { SettingsWidgets } from "./settings-widget/SettingsWidgets";

import * as layoutStyles from "../shared/Layout.module.scss";

interface IStateProps {
  isLightWallet: boolean;
  isIcbmWalletConnected: boolean;
  isLockedWalletConnected: boolean;
  userType?: EUserType;
  kycRequestType?: EKycRequestType;
  kycRequestStatus?: ERequestStatus;
}

export const SettingsComponent: React.FunctionComponent<IStateProps> = ({
  isLightWallet,
  isIcbmWalletConnected,
  isLockedWalletConnected,
  userType,
  kycRequestType,
  kycRequestStatus,
}) => {
  const isPersonalDataProcessed =
    kycRequestStatus === ERequestStatus.PENDING || kycRequestStatus === ERequestStatus.ACCEPTED;
  const isUserInvestor = userType === EUserType.INVESTOR;
  const isIndividual = kycRequestType === EKycRequestType.INDIVIDUAL;

  return (
    <LayoutAuthorized>
      <GridBaseLayout>
        <DashboardSection
          title={<FormattedMessage id="settings.security-settings.title" />}
          data-test-id="eto-dashboard-application"
        />
        <WidgetGridLayout>
          <SettingsWidgets
            isDynamic={false}
            isLightWallet={isLightWallet}
            layoutClass={layoutStyles.span3}
          />
        </WidgetGridLayout>

        <DashboardSection
          title={<FormattedMessage id="settings.account-info.title" />}
          data-test-id="eto-dashboard-application"
        />
        <WidgetGridLayout>
          <YourEthereumAddressWidget layoutClass={layoutStyles.span3} />
          {process.env.NF_CHECK_LOCKED_WALLET_WIDGET_ENABLED === "1" &&
            !isIcbmWalletConnected &&
            !isLockedWalletConnected &&
            isUserInvestor && <CheckYourICBMWalletWidget layoutClass={layoutStyles.span3} />}

          {isUserInvestor &&
            isIndividual &&
            isPersonalDataProcessed && <PersonalAccountDetails layoutClass={layoutStyles.span3} />}
        </WidgetGridLayout>

        <SectionHeader>
          <FormattedMessage id="settings.personal-settings.title" />
        </SectionHeader>
        <WidgetGridLayout>
          {process.env.NF_FEATURE_EMAIL_CHANGE_ENABLED === "1" && (
            <ChangeEmail layoutClass={layoutStyles.span3} />
          )}
          <LinkedBankAccountWidget layoutClass={layoutStyles.span3} />
        </WidgetGridLayout>
      </GridBaseLayout>
    </LayoutAuthorized>
  );
};

export const Settings = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  appConnect<IStateProps>({
    stateToProps: state => ({
      isLightWallet: selectIsLightWallet(state.web3),
      userType: selectUserType(state),
      kycRequestStatus: selectKycRequestStatus(state),
      kycRequestType: selectKycRequestType(state.kyc),
      isIcbmWalletConnected: selectIcbmWalletConnected(state.wallet),
      isLockedWalletConnected: selectLockedWalletConnected(state),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.wallet.loadWalletData());
      dispatch(actions.kyc.kycLoadIndividualData());
    },
  }),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.settings") })),
)(SettingsComponent);
