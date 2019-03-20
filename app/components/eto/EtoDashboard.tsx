import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
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
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SettingsWidgets } from "../settings/settings-widget/SettingsWidgets";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
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

interface IDispatchProps {
  loadFileDataStart: () => void;
}

type IProps = IStateProps & IDispatchProps;

const SubmitDashBoardSection: React.FunctionComponent<{ isTermSheetSubmitted?: boolean }> = ({
  isTermSheetSubmitted,
}) => (
  <>
    <DashboardSection
      step={3}
      title="UPLOAD FILES / SUBMIT PROPOSAL"
      data-test-id="eto-dashboard-verification"
    />
    {isTermSheetSubmitted ? (
      <Col lg={4} xs={12}>
        <SubmitProposalWidget />
      </Col>
    ) : (
      <Col lg={4} xs={12}>
        <UploadTermSheetWidget />
      </Col>
    )}
  </>
);

const EtoProgressDashboardSection: React.FunctionComponent = () => (
  <>
    <DashboardSection step={2} title="ETO APPLICATION" />
    <Col xs={12}>
      <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
    </Col>
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
            <SubmitDashBoardSection isTermSheetSubmitted={isTermSheetSubmitted} />
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
          {canEnableBookbuilding && (
            <Col lg={8} xs={12}>
              <BookBuildingWidget />
            </Col>
          )}
          {!isOfferingDocumentSubmitted && (
            <Col lg={4} xs={12}>
              {isRetailEto ? <UploadProspectusWidget /> : <UploadInvestmentMemorandum />}
            </Col>
          )}
          <Col xs={12}>
            <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
          </Col>
          <ETOFormsProgressSection />
        </>
      );
    case EEtoState.PROSPECTUS_APPROVED:
      return (
        <>
          <DashboardSection hasDecorator={false} title={dashboardTitle} />
          {canEnableBookbuilding && (
            <Col lg={8} xs={12}>
              <BookBuildingWidget />
            </Col>
          )}
          <Col xs={12}>
            <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
          </Col>
          <ETOFormsProgressSection />
        </>
      );
    case EEtoState.ON_CHAIN:
      return (
        <>
          <DashboardSection hasDecorator={false} title={dashboardTitle} />
          <Col lg={6} xs={12}>
            <UploadInvestmentAgreement />
          </Col>
          <Col lg={6} xs={12}>
            <ChooseEtoStartDateWidget />
          </Col>
          <Col lg={6} xs={12}>
            <BookBuildingWidget />
          </Col>
          <Col xs={12}>
            <FormattedHTMLMessage tagName="span" id="eto-dashboard-application-description" />
          </Col>
          <ETOFormsProgressSection />
        </>
      );
    default:
      return <DashboardSection hasDecorator={false} title={dashboardTitle} />;
  }
};

class EtoDashboardComponent extends React.Component<IProps> {
  componentDidMount(): void {
    const { shouldEtoDataLoad, loadFileDataStart } = this.props;

    if (shouldEtoDataLoad) loadFileDataStart();
  }

  render(): React.ReactNode {
    const {
      verifiedEmail,
      backupCodesVerified,
      requestStatus,
      etoState,
      canEnableBookbuilding,
      etoFormProgress,
      isTermSheetSubmitted,
      shouldEtoDataLoad,
      isOfferingDocumentSubmitted,
      previewCode,
      isRetailEto,
    } = this.props;

    const isVerificationSectionDone = !!(
      verifiedEmail &&
      backupCodesVerified &&
      requestStatus === ERequestStatus.ACCEPTED
    );
    const shouldViewSubmissionSection = !!(
      etoFormProgress && etoFormProgress >= SUBMIT_PROPOSAL_THRESHOLD
    );

    return (
      <LayoutAuthorized>
        <Row className="row-gutter-top" data-test-id="eto-dashboard-application">
          {!isVerificationSectionDone && (
            <>
              <DashboardSection
                step={1}
                title="VERIFICATION"
                data-test-id="eto-dashboard-verification"
              />
              <SettingsWidgets isDynamic={true} {...this.props} />
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
        </Row>
      </LayoutAuthorized>
    );
  }
}

const EtoDashboard = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  onEnterAction({
    actionCreator: d => d(actions.etoFlow.loadIssuerEto()),
  }),
  appConnect<IStateProps, IDispatchProps>({
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
    dispatchToProps: dispatch => ({
      loadFileDataStart: () => dispatch(actions.etoDocuments.loadFileDataStart()),
    }),
  }),
)(EtoDashboardComponent);

export { EtoDashboard, EtoDashboardComponent, EtoDashboardStateViewComponent };
