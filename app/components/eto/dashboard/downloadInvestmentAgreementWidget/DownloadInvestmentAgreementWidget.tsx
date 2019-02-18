import {branch, renderComponent} from "recompose";
import * as React from "react";
import {compose} from "redux";
import {FormattedMessage} from "react-intl-phraseapp";
import * as cn from "classnames";

import {Panel} from "../../../shared/Panel";
import {createErrorBoundary} from "../../../shared/errorBoundary/ErrorBoundary";
import {ErrorBoundaryPanel} from "../../../shared/errorBoundary/ErrorBoundaryPanel";
import {appConnect, IAppState} from "../../../../store";
import * as styles from "../../EtoContentWidget.module.scss";
import {ButtonArrowRight} from "../../../shared/buttons/Button";
import {EETOStateOnChain} from "../../../../modules/public-etos/types";
import {selectEtoId, selectIssuerEtoDocuments} from "../../../../modules/eto-flow/selectors";
import {selectEtoOnChainStateById} from "../../../../modules/public-etos/selectors";
import {actions} from "../../../../modules/actions";
import {EEtoDocumentType, IEtoDocument} from "../../../../lib/api/eto/EtoFileApi.interfaces";
import {NullComponent} from "../../shared/NullComponent";
import {PanelHeader} from "../../../shared/PanelHeader";
import {selectEtoDocumentData} from "../../../../modules/eto-documents/selectors";


interface IDispatchProps {
  downloadAgreementTemplate: (agreementTemplate: IEtoDocument) => void;
}

interface IStateProps {
  stateOnChain?: EETOStateOnChain;
  agreementTemplate: IEtoDocument;
  uploadedAgreement: IEtoDocument | null;
}

interface IComponentStateProps {
  agreementTemplate: IEtoDocument;
  uploadedAgreement: IEtoDocument | null;
}

export const DownloadInvestmentAgreementLayout: React.FunctionComponent<IComponentStateProps & IDispatchProps> =
  ({downloadAgreementTemplate, agreementTemplate, uploadedAgreement}) => {
    if (uploadedAgreement === null) { //not uploaded
      return (
        <Panel>
          <PanelHeader headerText={<FormattedMessage id="download-agreement-widget.signing-title"/>}/>
          <div className={styles.content}>
            <p className={cn(styles.text, "pt-2")}>
              <FormattedMessage id="download-agreement-widget.signing-text"/>
            </p>
            <ButtonArrowRight data-test-id="eto-dashboard-submit-proposal"
                              onClick={() => downloadAgreementTemplate(agreementTemplate)}>
              <FormattedMessage id="download-agreement-widget.download-and-sign"/>
            </ButtonArrowRight>
          </div>
        </Panel>
      )
    } else if (etoCommitment.signedInvestmentAgreementUrl() === undefined) { //uploaded, not signed
      // widget says sign me
      return null
    } else if (etoCommitment.signedInvestmentAgreementUrl() === uploadedAgreement.ipfsHash) { // uploaded, signed
      // widget says wait for nominee to sign it
      return null
    }
  }

export const EtoCompletedWidgetLayout: React.ComponentType<any> = ({goToWallet}) => { //fixme
  return (
    <Panel>
      <PanelHeader headerText={<FormattedMessage id="download-agreement-widget.success-title"/>}/>
      <div className={styles.content}>
        <ButtonArrowRight data-test-id="eto-dashboard-submit-proposal" onClick={goToWallet}>
          <FormattedMessage id="download-agreement-widget.go-to-wallet"/>
        </ButtonArrowRight>
      </div>
    </Panel>
  )
}

const selectDoc = (state: IAppState): IEtoDocument | null => { //fixme this goes into selectors
  const etoDocuments = selectIssuerEtoDocuments(state)!;
  console.log("DownloadInvestmentAgreement", etoDocuments)

  const key = Object.keys(etoDocuments).find(
    uploadedKey => etoDocuments[uploadedKey].documentType === EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT
  )
  return key ? etoDocuments[key] : null
}

export const DownloadInvestmentAgreement = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IStateProps | null, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectEtoId(state);
      if (etoId) {
        return ({
          stateOnChain: selectEtoOnChainStateById(state, etoId),
          agreementTemplate: selectEtoDocumentData(state.etoDocuments).allTemplates.investmentAndShareholderAgreementTemplate,
          uploadedAgreement: selectDoc(state)
        })
      } else {
        return null
      }
    },
    dispatchToProps: (dispatch) => ({
      downloadAgreementTemplate: (agreementTemplate: IEtoDocument) => {
        return dispatch(
          actions.etoDocuments.generateTemplate(agreementTemplate)
        )
      }
    }),
  }),
  branch<IStateProps | null>(props => props === null, renderComponent(NullComponent)),
  branch<IStateProps>(props => (
    props.stateOnChain === EETOStateOnChain.Claim || props.stateOnChain === EETOStateOnChain.Payout
  ), renderComponent(EtoCompletedWidgetLayout)),
  branch<IStateProps>(props => props.stateOnChain !== EETOStateOnChain.Signing, renderComponent(NullComponent)),
)(DownloadInvestmentAgreementLayout);
