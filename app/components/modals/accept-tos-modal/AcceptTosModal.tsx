import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { EUserType } from "../../../lib/api/users/interfaces";
import { actions } from "../../../modules/actions";
import {
  selectIsAgreementAccepted,
  selectIsLatestAgreementAccepted,
  selectIsLatestAgreementLoaded,
  selectUserType,
} from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { Button, EButtonLayout } from "../../shared/buttons";
import { ModalComponentBody } from "../ModalComponentBody";

interface IStateProps {
  isOpen: boolean;
  userType?: EUserType;
  agreementChanged: boolean;
}

interface IDispatchProps {
  onAccept: () => void;
  onDownloadTos: () => void;
  onLogout: (userType?: EUserType) => void;
}

export const AcceptTosModalInner: React.ComponentType<IStateProps & IDispatchProps> = ({
  onDownloadTos,
  userType,
  onLogout,
  onAccept,
  agreementChanged,
}) => {
  return (
    <section className="text-center">
      <h1>
        {agreementChanged ? (
          <FormattedHTMLMessage tagName="span" id="settings.modal.accept-updated-tos.title" />
        ) : (
          <FormattedMessage id="settings.modal.accept-tos.title" />
        )}
      </h1>
      <p className="mt-4 mb-2">
        <FormattedMessage id="settings.modal.accept-tos.text" />
      </p>
      <div className="mt-2 mb-2">
        <Button
          onClick={onDownloadTos}
          layout={EButtonLayout.SECONDARY}
          data-test-id="modals.accept-tos.download-button"
        >
          <FormattedMessage id="settings.modal.accept-tos.download-button" />
        </Button>
      </div>
      <div className="mt-4 mb-2">
        <Button
          onClick={onAccept}
          layout={EButtonLayout.PRIMARY}
          data-test-id="modals.accept-tos.accept-button"
        >
          <FormattedMessage id="settings.modal.accept-tos.accept-button" />
        </Button>
      </div>
      <div>
        <Button onClick={() => onLogout(userType)} layout={EButtonLayout.SIMPLE}>
          <FormattedMessage id="settings.modal.accept-tos.logout-button" />
        </Button>
      </div>
      {/* this is a small div element used by the e2e tests to accept the ToU without having to download them, which does not work on electron */}
      {/* a cleaner solution would be greatly appreciated, force: click does not work here :( */}
      <div
        data-test-id="modals.accept-tos.accept-button-hidden"
        onClick={onAccept}
        style={{ height: 5 }}
      />
    </section>
  );
};

const AcceptTosModalComponent: React.FunctionComponent<IStateProps & IDispatchProps> = props => (
  <ModalComponentBody isOpen={props.isOpen}>
    <AcceptTosModalInner {...props} />
  </ModalComponentBody>
);

export const AcceptTosModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    agreementChanged: selectIsAgreementAccepted(s) && !selectIsLatestAgreementAccepted(s),
    isOpen: !selectIsLatestAgreementAccepted(s) && selectIsLatestAgreementLoaded(s),
    userType: selectUserType(s),
  }),
  dispatchToProps: dispatch => ({
    onDownloadTos: () => dispatch(actions.tosModal.downloadCurrentAgreement()),
    onAccept: () => dispatch(actions.tosModal.acceptCurrentAgreement()),
    onLogout: (userType?: EUserType) => dispatch(actions.auth.logout(userType)),
  }),
})(AcceptTosModalComponent);
