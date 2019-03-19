import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";
import { withProps } from "recompose";
import { compose } from "redux";

import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { ERequestStatus } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import { selectBackupCodesVerified, selectVerifiedUserEmail } from "../../modules/auth/selectors";
import {
  selectCanEnableBookBuilding,
  selectCombinedEtoCompanyData,
  selectIsOfferingDocumentSubmitted,
  selectIssuerEtoIsRetail,
  selectIssuerEtoPreviewCode,
  selectIssuerEtoState,
  selectIsTermSheetSubmitted,
  selectShouldEtoDataLoad,
} from "../../modules/eto-flow/selectors";
import { calculateGeneralEtoData } from "../../modules/eto-flow/utils";
import { selectKycRequestStatus } from "../../modules/kyc/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SettingsWidgets } from "../settings/settings-widget/SettingsWidgets";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { GridBaseLayout, WidgetGridLayout } from "../shared/Layout";
import { LoadingIndicator } from "../shared/loading-indicator";
import { BookBuildingWidget } from "./dashboard/bookBuildingWidget/BookBuildingWidget";
import { ChooseEtoStartDateWidget } from "./dashboard/chooseEtoStartDateWidget/ChooseEtoStartDateWidget";
import { ETOFormsProgressSection } from "./dashboard/ETOFormsProgressSection";
import { UploadInvestmentAgreement } from "./dashboard/signInvestmentAgreementWidget/UploadInvestmentAgreementWidget";
import { SubmitProposalWidget } from "./dashboard/submitProposalWidget/SubmitProposalWidget";
import { UploadInvestmentMemorandum } from "./dashboard/UploadInvestmentMemorandum";
import { UploadProspectusWidget } from "./dashboard/UploadProspectusWidget";
import { UploadTermSheetWidget } from "./dashboard/UploadTermSheetWidget";
import { DashboardSection } from "./shared/DashboardSection";
import { EProjecStatusLayout, EProjectStatusSize, ETOState } from "./shared/ETOState";

import * as layoutStyles from "../shared/Layout.module.scss";
import * as styles from "./EtoDashboard.module.scss";

const SUBMIT_PROPOSAL_THRESHOLD = 1;

interface IStateProps {
  verifiedEmail?: string;
  backupCodesVerified?: boolean;
  isLightWallet: boolean;
  shouldEtoDataLoad?: boolean;
  requestStatus?: ERequestStatus;
  etoState?: EEtoState;
  previewCode?: string;
  canEnableBookbuilding: boolean;
  etoFormProgress?: number;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  isRetailEto: boolean;
}

interface IComponentStateProps {
  etoState?: EEtoState;
  canEnableBookbuilding: boolean;
  isTermSheetSubmitted?: boolean;
  shouldEtoDataLoad?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  previewCode?: string;
  isRetailEto: boolean;
}

interface IComputedProps {
  isVerificationSectionDone: boolean;
  shouldViewSubmissionSection: boolean;
}

const SubmitDashBoardSection: React.FunctionComponent<{
  isTermSheetSubmitted?: boolean;
  layoutClass?: string;
}> = ({ isTermSheetSubmitted, layoutClass }) => (
  <>
    <DashboardSection
      step={3}
      title="UPLOAD FILES / SUBMIT PROPOSAL"
      data-test-id="eto-dashboard-verification"
    />
    <WidgetGridLayout>
      {isTermSheetSubmitted ? (
        <SubmitProposalWidget layoutClass={layoutClass} />
      ) : (
        <UploadTermSheetWidget layoutClass={layoutClass} />
      )}
    </WidgetGridLayout>
  </>
);

const EtoProgressDashboardSection: React.FunctionComponent = () => (
  <>
    <DashboardSection step={2} title="ETO APPLICATION" className={styles.etoState} />
    <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
    <ETOFormsProgressSection />
  </>
);

interface IEtoStateRender {
  etoState?: EEtoState;
  shouldViewSubmissionSection?: boolean;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  canEnableBookbuilding: boolean;
  previewCode?: string;
  isRetailEto: boolean;
}

const EtoDashboardStateViewComponent: React.FunctionComponent<IEtoStateRender> = ({
  etoState,
  shouldViewSubmissionSection,
  isTermSheetSubmitted,
  isOfferingDocumentSubmitted,
  canEnableBookbuilding,
  previewCode,
  isRetailEto,
}) => {
  if (!previewCode) {
    return <LoadingIndicator />;
  }
  const dashboardTitle = (
    <ETOState
      previewCode={previewCode}
      size={EProjectStatusSize.LARGE}
      layout={EProjecStatusLayout.BLACK}
    />
  );
  switch (etoState) {
    case EEtoState.PREVIEW:
      return (
        <>
          {shouldViewSubmissionSection && (
            <SubmitDashBoardSection
              isTermSheetSubmitted={isTermSheetSubmitted}
              layoutClass={layoutStyles.span4}
            />
          )}
          <EtoProgressDashboardSection />
        </>
      );
    case EEtoState.PENDING:
      return (
        <>
          <DashboardSection hasDecorator={false} title={dashboardTitle} />
          <ETOFormsProgressSection />
        </>
      );
    case EEtoState.LISTED:
      return (
        <>
          <DashboardSection hasDecorator={false} title={dashboardTitle} />
          <WidgetGridLayout>
            {canEnableBookbuilding && <BookBuildingWidget layoutClass={layoutStyles.span4} />}
            {!isOfferingDocumentSubmitted &&
              (isRetailEto ? (
                <UploadProspectusWidget layoutClass={layoutStyles.span2} />
              ) : (
                <UploadInvestmentMemorandum layoutClass={layoutStyles.span2} />
              ))}
          </WidgetGridLayout>
          <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
          <ETOFormsProgressSection />
        </>
      );
    case EEtoState.PROSPECTUS_APPROVED:
      return (
        <>
          <DashboardSection hasDecorator={false} title={dashboardTitle} />
          <WidgetGridLayout>
            {canEnableBookbuilding && <BookBuildingWidget layoutClass={layoutStyles.span4} />}
          </WidgetGridLayout>
          <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
          <ETOFormsProgressSection />
        </>
      );
    case EEtoState.ON_CHAIN:
      return (
        <>
          <DashboardSection hasDecorator={false} title={dashboardTitle} />
          <WidgetGridLayout>
            <UploadInvestmentAgreement layoutClass={layoutStyles.span3} />
            <BookBuildingWidget layoutClass={layoutStyles.span3} />
            <ChooseEtoStartDateWidget layoutClass={layoutStyles.span3} />
          </WidgetGridLayout>
          <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
          <ETOFormsProgressSection />
        </>
      );
    default:
      return <DashboardSection hasDecorator={false} title={dashboardTitle} />;
  }
};

const EtoDashboardComponent: React.FunctionComponent<
  IComponentStateProps & IComputedProps
> = props => {
  const {
    etoState,
    canEnableBookbuilding,
    isTermSheetSubmitted,
    shouldEtoDataLoad,
    isOfferingDocumentSubmitted,
    previewCode,
    isRetailEto,
    isVerificationSectionDone,
    shouldViewSubmissionSection,
  } = props;

  return (
    <GridBaseLayout dataTestId="eto-dashboard-application">
      {!isVerificationSectionDone && (
        <>
          <DashboardSection
            step={1}
            title="VERIFICATION"
            data-test-id="eto-dashboard-verification"
          />
          <WidgetGridLayout>
            <SettingsWidgets isDynamic={true} {...props} layoutClass={layoutStyles.span3} />
          </WidgetGridLayout>
        </>
      )}

      {shouldEtoDataLoad ? (
        <EtoDashboardStateViewComponent
          isTermSheetSubmitted={isTermSheetSubmitted}
          isOfferingDocumentSubmitted={isOfferingDocumentSubmitted}
          shouldViewSubmissionSection={shouldViewSubmissionSection}
          etoState={etoState}
          canEnableBookbuilding={canEnableBookbuilding}
          previewCode={previewCode}
          isRetailEto={isRetailEto}
        />
      ) : (
        <EtoProgressDashboardSection />
      )}
    </GridBaseLayout>
  );
};

const EtoDashboard = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  onEnterAction({
    actionCreator: d => d(actions.etoFlow.loadIssuerEto()),
  }),
  appConnect<IStateProps>({
    stateToProps: s => ({
      verifiedEmail: selectVerifiedUserEmail(s.auth),
      backupCodesVerified: selectBackupCodesVerified(s),
      isLightWallet: selectIsLightWallet(s.web3),
      shouldEtoDataLoad: selectShouldEtoDataLoad(s),
      requestStatus: selectKycRequestStatus(s),
      etoState: selectIssuerEtoState(s),
      previewCode: selectIssuerEtoPreviewCode(s),
      canEnableBookbuilding: selectCanEnableBookBuilding(s),
      isTermSheetSubmitted: selectIsTermSheetSubmitted(s),
      isOfferingDocumentSubmitted: selectIsOfferingDocumentSubmitted(s),
      etoFormProgress: calculateGeneralEtoData(selectCombinedEtoCompanyData(s)),
      isRetailEto: selectIssuerEtoIsRetail(s),
    }),
  }),
  withProps<IComputedProps, IStateProps>(props => ({
    isVerificationSectionDone: !!(
      props.verifiedEmail &&
      props.backupCodesVerified &&
      props.requestStatus === ERequestStatus.ACCEPTED
    ),
    shouldViewSubmissionSection: !!(
      props.etoFormProgress && props.etoFormProgress >= SUBMIT_PROPOSAL_THRESHOLD
    ),
  })),
  onEnterAction({
    actionCreator: (dispatch, props) => {
      if (props.shouldEtoDataLoad) {
        dispatch(actions.kyc.kycLoadIndividualDocumentList());
      }
      if (props.shouldEtoDataLoad) {
        dispatch(actions.etoDocuments.loadFileDataStart());
      }
    },
  }),
  withContainer(LayoutAuthorized),
)(EtoDashboardComponent);

export { EtoDashboard, EtoDashboardComponent, EtoDashboardStateViewComponent };
