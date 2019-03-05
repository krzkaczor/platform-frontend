import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, renderComponent, renderNothing } from "recompose";
import { compose } from "redux";

import { IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../../modules/actions";
import { selectEtoDocumentData } from "../../../../modules/eto-documents/selectors";
import {
  selectEtoId,
  selectUploadedInvestmentAgreement,
} from "../../../../modules/eto-flow/selectors";
import { selectEtoOnChainStateById } from "../../../../modules/public-etos/selectors";
import { EETOStateOnChain } from "../../../../modules/public-etos/types";
import { appConnect } from "../../../../store";
import { ButtonArrowRight } from "../../../shared/buttons/Button";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryPanel } from "../../../shared/errorBoundary/ErrorBoundaryPanel";
import { Panel } from "../../../shared/Panel";
import { PanelHeader } from "../../../shared/PanelHeader";
import { SignInvestmentAgreement } from "./SignInvestmentAgreement";

import * as styles from "../../EtoContentWidget.module.scss";

interface IDispatchProps {
  downloadAgreementTemplate: (agreementTemplate: IEtoDocument) => void;
}

interface IStateProps {
  stateOnChain: EETOStateOnChain;
  agreementTemplate: IEtoDocument;
  uploadedAgreement: IEtoDocument | null;
}

interface IUploadComponentStateProps {
  agreementTemplate: IEtoDocument;
  uploadedAgreement: IEtoDocument | null;
}

export const UploadInvestmentAgreementLayout: React.FunctionComponent<
  IUploadComponentStateProps & IDispatchProps
> = ({ downloadAgreementTemplate, agreementTemplate }) => {
  return (
    <Panel>
      <PanelHeader headerText={<FormattedMessage id="download-agreement-widget.signing-title" />} />
      <div className={styles.content}>
        <p className={cn(styles.text, "pt-2")}>
          <FormattedMessage id="download-agreement-widget.signing-text" />
        </p>
        <ButtonArrowRight
          data-test-id="eto-dashboard-submit-proposal"
          onClick={() => downloadAgreementTemplate(agreementTemplate)}
        >
          <FormattedMessage id="download-agreement-widget.download-and-sign" />
        </ButtonArrowRight>
      </div>
    </Panel>
  );
};

export const EtoCompletedWidgetLayout: React.ComponentType<any> = ({ goToWallet }) => (
  <Panel>
    <PanelHeader headerText={<FormattedMessage id="download-agreement-widget.success-title" />} />
    <div className={styles.content}>
      <ButtonArrowRight data-test-id="eto-dashboard-submit-proposal" onClick={goToWallet}>
        <FormattedMessage id="download-agreement-widget.go-to-wallet" />
      </ButtonArrowRight>
    </div>
  </Panel>
);

export const UploadInvestmentAgreement = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IStateProps | null, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectEtoId(state);
      if (etoId) {
        return {
          stateOnChain: selectEtoOnChainStateById(state, etoId)!,
          agreementTemplate: selectEtoDocumentData(state.etoDocuments).allTemplates
            .investmentAndShareholderAgreementTemplate,
          uploadedAgreement: selectUploadedInvestmentAgreement(state),
        };
      } else {
        return null;
      }
    },
    dispatchToProps: dispatch => ({
      downloadAgreementTemplate: (agreementTemplate: IEtoDocument) => {
        return dispatch(actions.etoDocuments.generateTemplate(agreementTemplate));
      },
    }),
  }),
  branch<IStateProps | null>(props => props === null, renderNothing),
  branch<IStateProps>(props => props.stateOnChain < EETOStateOnChain.Signing, renderNothing),
  branch<IStateProps>(props => props.stateOnChain === EETOStateOnChain.Refund, renderNothing),
  branch<IStateProps>(
    props => props.stateOnChain > EETOStateOnChain.Signing,
    renderComponent(EtoCompletedWidgetLayout),
  ),
  branch<IStateProps>(
    props => props.uploadedAgreement !== null,
    renderComponent(SignInvestmentAgreement),
  ),
)(UploadInvestmentAgreementLayout);

//invalid state, props invalid
//stateOnChain is < signing
//stateOnChain is refund
//stateOnChain is Claim, Payout
//uploadedAgreement is there
//uploadedAgreement is null
//----------//
//signed agreement loading
//signed agreement loaded, it's null
//signed agreemtn loaded, it's a string
