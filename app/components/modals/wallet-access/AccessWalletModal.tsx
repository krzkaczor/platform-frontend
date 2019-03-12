import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../modules/actions";
import { selectIsUnlocked, selectWalletType } from "../../../modules/web3/selectors";
import { EWalletType } from "../../../modules/web3/types";
import { appConnect } from "../../../store";
import { TTranslatedString } from "../../../types";
import { HiResImage } from "../../shared/HiResImage";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { ModalComponentBody } from "../ModalComponentBody";
import { AccessLightWalletPrompt } from "./AccessLightWalletPrompt";

import * as ledgerConfirm from "../../../assets/img/wallet_selector/ledger_confirm.svg";
import * as lockIcon from "../../../assets/img/wallet_selector/lock_icon.svg";
import * as styles from "./AccessWalletModal.module.scss";

interface IStateProps {
  errorMessage?: TTranslatedString;
  title?: TTranslatedString;
  message?: TTranslatedString;
  walletType: EWalletType | undefined;
  isUnlocked: boolean;
}

interface IDispatchProps {
  onAccept: (password?: string) => void;
}

interface IExternalProps {
  title?: TTranslatedString;
  message?: TTranslatedString;
}

export const AccessWalletContainerComponent: React.FunctionComponent<
  IStateProps & IDispatchProps
> = ({ title, message, errorMessage, isUnlocked, onAccept, walletType }) => (
  <div className="text-center">
    {title && <h1>{title}</h1>}
    {message && <p>{message}</p>}
    {walletType === EWalletType.LIGHT && (
      <div>
        <img src={lockIcon} className="mt-3 mb-3" />
        <AccessLightWalletPrompt onAccept={onAccept} isUnlocked={isUnlocked} />
      </div>
    )}
    {walletType === EWalletType.LEDGER && (
      <div>
        <img src={ledgerConfirm} className="mt-1 mb-3" />
        <div className={cn("mt-2", styles.info)}>
          <FormattedMessage id="modal.access-wallet.ledger-info" />
        </div>
      </div>
    )}
    {walletType === EWalletType.BROWSER && (
      <div>
        <HiResImage
          partialPath="wallet_selector/logo_metamask"
          alt="Parity"
          title="Parity"
          className="mt-3 mb-3"
        />
        <div className={cn("mt-2", styles.info)}>
          <FormattedMessage id="modal.access-wallet.metamask-info" />
        </div>
      </div>
    )}
    {errorMessage && <p className={cn("mt-3", "text-warning")}>{errorMessage}</p>}
  </div>
);

export const AccessWalletContainer = appConnect<IStateProps, IDispatchProps, IExternalProps>({
  stateToProps: (s, external) => ({
    isOpen: s.accessWallet.isModalOpen,
    errorMessage: s.accessWallet.errorMessage
      ? getMessageTranslation(s.accessWallet.errorMessage)
      : undefined,
    title: external.title
      ? external.title
      : s.accessWallet.modalTitle && getMessageTranslation(s.accessWallet.modalTitle),
    message: external.message
      ? external.message
      : s.accessWallet.modalMessage && getMessageTranslation(s.accessWallet.modalMessage),
    walletType: selectWalletType(s.web3),
    isUnlocked: selectIsUnlocked(s.web3),
  }),
  dispatchToProps: dispatch => ({
    onAccept: (password?: string) => dispatch(actions.signMessageModal.accept(password)),
  }),
})(AccessWalletContainerComponent);

interface IModalStateProps {
  isOpen: boolean;
}

interface IModalDispatchProps {
  onCancel: () => void;
}

const AccessWalletModalComponent: React.FunctionComponent<
  IModalStateProps & IModalDispatchProps
> = props => (
  <ModalComponentBody isOpen={props.isOpen} onClose={props.onCancel}>
    <AccessWalletContainer />
  </ModalComponentBody>
);

export const AccessWalletModal = appConnect<IModalStateProps, IModalDispatchProps>({
  stateToProps: s => ({
    isOpen: s.accessWallet.isModalOpen,
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.signMessageModal.hideAccessWalletModal()),
  }),
})(AccessWalletModalComponent);
