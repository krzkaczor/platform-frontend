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
import { investmentAgreementNotSigned } from "../../../documents/utils";
import { ButtonArrowRight } from "../../../shared/buttons/Button";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { Panel } from "../../../shared/Panel";

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

export const WaitingForNominee = () => (
  <Panel>
    <Heading size={EHeadingSize.SMALL} level={4}>
      <FormattedMessage id="download-agreement-widget.wait-for-nominee-to-sign" />
    </Heading>
    <div className={styles.content}>
      <p className={cn(styles.text, "pt-2")}>
        <FormattedMessage id="download-agreement-widget.wait-for-nominee-to-sign-text" />
      </p>
    </div>
  </Panel>
);

interface IWaitingToBeSigned {
  etoId: string;
  ipfsHash: string;
  signedInvestmentAgreementUrl: null | string;
  signInvestmentAgreement: (etoId: string, ipfsHash: string) => void;
}

export const WaitingToBeSigned = ({
  etoId,
  ipfsHash,
  signedInvestmentAgreementUrl,
  signInvestmentAgreement,
}: IWaitingToBeSigned) => (
  <Panel>
    <Heading size={EHeadingSize.SMALL} level={4}>
      <FormattedMessage id="download-agreement-widget.sign-on-ethereum" />
    </Heading>
    <div className={styles.content}>
      <p className={cn(styles.text, "pt-2")}>
        {signedInvestmentAgreementUrl === null ? (
          <FormattedMessage id="download-agreement-widget.sign-on-ethereum-text" />
        ) : (
          <FormattedMessage id="download-agreement-widget.sign-again-text" />
        )}
      </p>
      <ButtonArrowRight
        data-test-id="eto-dashboard-submit-proposal"
        onClick={() => signInvestmentAgreement(etoId, ipfsHash)}
      >
        <FormattedMessage id="download-agreement-widget.sign-on-ethereum" />
      </ButtonArrowRight>
    </div>
  </Panel>
);

export const SignInvestmentAgreementLayout: React.FunctionComponent<
  ISignComponentStateProps & IDispatchProps
> = ({ etoId, signedInvestmentAgreementUrl, uploadedAgreement, signInvestmentAgreement }) => {
  return investmentAgreementNotSigned(signedInvestmentAgreementUrl, uploadedAgreement.ipfsHash) ? (
    <WaitingToBeSigned
      etoId={etoId}
      ipfsHash={uploadedAgreement.ipfsHash}
      signedInvestmentAgreementUrl={signedInvestmentAgreementUrl}
      signInvestmentAgreement={signInvestmentAgreement}
    />
  ) : (
    <WaitingForNominee />
  );
};

export const SignInvestmentAgreement = compose<React.FunctionComponent>(
  appConnect<IStateProps | null, IDispatchProps>({
    stateToProps: state => {
      const uploadedAgreement = selectUploadedInvestmentAgreement(state);

      const etoId = selectEtoId(state);
      // there is another widget showing up if there's no agreement uploaded,
      // so uploadedAgreement=== null is not a valid case
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
