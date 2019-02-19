import * as React from "react";
import {compose} from "redux";
import {FormattedMessage} from "react-intl-phraseapp";
import * as cn from "classnames";

import {Panel} from "../../../shared/Panel";
import {PanelHeader} from "../../../shared/PanelHeader";
import {ButtonArrowRight} from "../../../shared/buttons/Button";
import {IEtoDocument} from "../../../../lib/api/eto/EtoFileApi.interfaces";
import {appConnect} from "../../../../store";
import {onEnterAction} from "../../../../utils/OnEnterAction";
import {
  selectEtoId,
  selectInvestmentAgreementLoading,
  selectSignedInvestmentAgreementUrl,
  selectUploadedInvestmentAgreement
} from "../../../../modules/eto-flow/selectors";

import * as styles from "../../EtoContentWidget.module.scss";
import {actions} from "../../../../modules/actions";
import {branch, renderComponent, renderNothing} from "recompose";
import {LoadingIndicator} from "../../../shared/loading-indicator/LoadingIndicator";

interface IDispatchProps {
  signInvestmentAgreement: (etoId: string, agreementHash: string) => void;
}

interface IStateProps {
  uploadedAgreement: IEtoDocument | null;
  signedInvestmentAgreementUrlLoading: boolean;
  signedInvestmentAgreementUrl: string | null
}

interface ISignComponentStateProps {
  etoId: string;
  uploadedAgreement: IEtoDocument;
  signedInvestmentAgreementUrlLoading: boolean;
  signedInvestmentAgreementUrl: string | null
}

export const SignInvestmentAgreementLayout: React.FunctionComponent<ISignComponentStateProps & IDispatchProps> =
  ({etoId, signedInvestmentAgreementUrl, uploadedAgreement, signInvestmentAgreement}) => {
    console.log("SignInvestmentAgreementLayout", signedInvestmentAgreementUrl, uploadedAgreement.ipfsHash)

    if (signedInvestmentAgreementUrl === null) { //uploaded, not signed
      // widget says sign me
      return (
        <Panel>
          <PanelHeader headerText={<FormattedMessage id="download-agreement-widget.sign-on-ethereum"/>}/>
          <div className={styles.content}>
            <p className={cn(styles.text, "pt-2")}>
              <FormattedMessage id="download-agreement-widget.sign-on-ethereum-text"/>
            </p>
            <ButtonArrowRight data-test-id="eto-dashboard-submit-proposal"
                              onClick={() => signInvestmentAgreement(etoId, uploadedAgreement.ipfsHash)}>
              <FormattedMessage id="download-agreement-widget.sign-on-ethereum"/>
            </ButtonArrowRight>
          </div>
        </Panel>
      )
    } else if (signedInvestmentAgreementUrl === `ifps:${uploadedAgreement.ipfsHash}`) { // uploaded, signed
      // widget says wait for nominee to sign it
      return (
        <Panel>
          <PanelHeader headerText={<FormattedMessage id="download-agreement-widget.wait-for-nominee-to-sign"/>}/>
          <div className={styles.content}>
            <p className={cn(styles.text, "pt-2")}>
              <FormattedMessage id="download-agreement-widget.wait-for-nominee-to-sign-text"/>
            </p>
          </div>
        </Panel>
      )
    } else {
      return <>bla</>
    }
  }

export const SignInvestmentAgreement = compose<React.FunctionComponent>(
  appConnect<IStateProps | null, IDispatchProps>({
    stateToProps: state => {
      const uploadedAgreement = selectUploadedInvestmentAgreement(state);

      const etoId = selectEtoId(state);
      if (etoId && uploadedAgreement) {
        return {
          etoId,
          uploadedAgreement,
          signedInvestmentAgreementUrlLoading: selectInvestmentAgreementLoading(state),
          signedInvestmentAgreementUrl: selectSignedInvestmentAgreementUrl(state),
        }
      } else {
        return null
      }
    },
    dispatchToProps: dispatch => {
      return {
        signInvestmentAgreement: (etoId: string, agreementHash: string) => dispatch(actions.etoFlow.signInvestmentAgreement(etoId, agreementHash))
      }
    }
  }),
  branch<IStateProps | null>(props => props === null, renderNothing),
  onEnterAction(
    {actionCreator: (dispatch, props) => dispatch(actions.etoFlow.loadSignedInvestmentAgreement(props.etoId))}
  ),
  branch<IStateProps>(props => props.signedInvestmentAgreementUrlLoading, renderComponent(LoadingIndicator)),
)(SignInvestmentAgreementLayout)


//invalid state, props invalid
//signed agreement loading
//signed agreement loaded, it's null
//signed agreemtn loaded, it's a string
