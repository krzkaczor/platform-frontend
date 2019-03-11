import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, renderComponent, renderNothing } from "recompose";
import { compose } from "redux";

import { IEtoDocument } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../../modules/actions";
import {
  selectEtoId,
  selectInvestmentAgreementLoading,
  selectSignedInvestmentAgreementUrl,
  selectUploadedInvestmentAgreement,
} from "../../../../modules/eto-flow/selectors";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { ButtonArrowRight } from "../../../shared/buttons/Button";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { Panel } from "../../../shared/Panel";
import { PanelHeader } from "../../../shared/PanelHeader";

import * as styles from "../../EtoContentWidget.module.scss";

interface IDispatchProps {
  signInvestmentAgreement: (etoId: string, agreementHash: string) => void;
}

interface IStateProps {
  uploadedAgreement: IEtoDocument | null;
  signedInvestmentAgreementUrlLoading: boolean;
  signedInvestmentAgreementUrl: string | null;
}

interface ISignComponentStateProps {
  etoId: string;
  uploadedAgreement: IEtoDocument;
  signedInvestmentAgreementUrlLoading: boolean;
  signedInvestmentAgreementUrl: string | null;
}

export const SignInvestmentAgreementLayout: React.FunctionComponent<ISignComponentStateProps & IDispatchProps> =
  ({ etoId, signedInvestmentAgreementUrl, uploadedAgreement, signInvestmentAgreement }) => {
  if (
    signedInvestmentAgreementUrl === null
    || signedInvestmentAgreementUrl !== `ifps:${uploadedAgreement.ipfsHash}`
  ) {
    //uploaded, not signed
    // widget says sign me
    return (
      <Panel>
        <PanelHeader
          headerText={<FormattedMessage id="download-agreement-widget.sign-on-ethereum" />}
        />
        <div className={styles.content}>
          <p className={cn(styles.text, "pt-2")}>
            <FormattedMessage id="download-agreement-widget.sign-on-ethereum-text" />
          </p>
          <ButtonArrowRight
            data-test-id="eto-dashboard-submit-proposal"
            onClick={() => signInvestmentAgreement(etoId, uploadedAgreement.ipfsHash)}
          >
            <FormattedMessage id="download-agreement-widget.sign-on-ethereum" />
          </ButtonArrowRight>
        </div>
      </Panel>
    );
  } else {
    // uploaded, signed
    // widget says wait for nominee to sign it
    return (
      <Panel>
        <PanelHeader
          headerText={<FormattedMessage id="download-agreement-widget.wait-for-nominee-to-sign" />}
        />
        <div className={styles.content}>
          <p className={cn(styles.text, "pt-2")}>
            <FormattedMessage id="download-agreement-widget.wait-for-nominee-to-sign-text" />
          </p>
        </div>
      </Panel>
    );
  }
};

export const SignInvestmentAgreement = compose<React.FunctionComponent>(
  appConnect<IStateProps | null, IDispatchProps>({
    stateToProps: state => {
      const uploadedAgreement = selectUploadedInvestmentAgreement(state);

      const etoId = selectEtoId(state);
      //there is another widget showing up if there's no agreement uploaded,
      // so uploadedAgreement=== null is an invalid case
      if (etoId && uploadedAgreement) {
        return {
          etoId,
          uploadedAgreement,
          signedInvestmentAgreementUrlLoading: selectInvestmentAgreementLoading(state),
          signedInvestmentAgreementUrl: selectSignedInvestmentAgreementUrl(state),
        };
      } else {
        return null;
      }
    },
    dispatchToProps: dispatch => {
      return {
        signInvestmentAgreement: (etoId: string, agreementHash: string) =>
          dispatch(actions.etoFlow.signInvestmentAgreement(etoId, agreementHash)),
      };
    },
  }),
  branch<IStateProps | null>(props => props === null, renderNothing),
  onEnterAction({
    actionCreator: (dispatch, props) =>
      dispatch(actions.etoFlow.loadSignedInvestmentAgreement(props.etoId)),
  }),
  branch<IStateProps>(
    props => props.signedInvestmentAgreementUrlLoading,
    renderComponent(LoadingIndicator),
  ),
)(SignInvestmentAgreementLayout);
