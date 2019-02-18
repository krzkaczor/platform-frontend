import {branch, renderComponent} from "recompose";
import * as React from "react";
import {compose} from "redux";
import {FormattedMessage} from "react-intl-phraseapp";
import * as cn from "classnames";

import {Panel} from "../../../shared/Panel";
import {createErrorBoundary} from "../../../shared/errorBoundary/ErrorBoundary";
import {ErrorBoundaryPanel} from "../../../shared/errorBoundary/ErrorBoundaryPanel";
import {appConnect} from "../../../../store";
import * as styles from "../../EtoContentWidget.module.scss";
import {ButtonArrowRight} from "../../../shared/buttons/Button";
import {EETOStateOnChain} from "../../../../modules/public-etos/types";
import {selectEtoId} from "../../../../modules/eto-flow/selectors";
import {selectEtoOnChainStateById} from "../../../../modules/public-etos/selectors";
import {actions} from "../../../../modules/actions";
import {IEtoDocument} from "../../../../lib/api/eto/EtoFileApi.interfaces";
import {withContainer} from "../../../../utils/withContainer";
import {NullComponent} from "../../shared/NullComponent";
import {PanelHeader} from "../../../shared/PanelHeader";
import {selectEtoDocumentData} from "../../../../modules/eto-documents/selectors";


interface IDispatchProps {
  downloadAgreementTemplate: (agreementTemplate: IEtoDocument) => void;
}

interface IStateProps {
  stateOnChain?: EETOStateOnChain;
  agreementTemplate: IEtoDocument;
}

interface IComponentStateProps {
  agreementTemplate: IEtoDocument;
}

export const DownloadInvestmentAgreementLayout: React.FunctionComponent<IComponentStateProps & IDispatchProps> = ({downloadAgreementTemplate, agreementTemplate}) => {
  return (
    <>
      <PanelHeader headerText={<FormattedMessage id="download-agreement-widget.title"/>}/>
      <div className={styles.content}>
        <p className={cn(styles.text, "pt-2")}>
          <FormattedMessage id="download-agreement-widget.text"/>
        </p>
        <ButtonArrowRight data-test-id="eto-dashboard-submit-proposal"
                          onClick={() => downloadAgreementTemplate(agreementTemplate)}>
          <FormattedMessage id="download-agreement-widget.download-and-sign"/>
        </ButtonArrowRight>
      </div>
    </>
  )
}

export const DownloadInvestmentAgreement = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryPanel),
  withContainer(Panel),
  appConnect<IStateProps | null, IDispatchProps>({
    stateToProps: state => {
      const etoId = selectEtoId(state);
      if (etoId) {
        return ({
          stateOnChain: selectEtoOnChainStateById(state, etoId),
          agreementTemplate: selectEtoDocumentData(state.etoDocuments).allTemplates.investmentAndShareholderAgreementTemplate,
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
  branch<IStateProps>(props => props.stateOnChain !== EETOStateOnChain.Signing, renderComponent(NullComponent)),
)(DownloadInvestmentAgreementLayout);
