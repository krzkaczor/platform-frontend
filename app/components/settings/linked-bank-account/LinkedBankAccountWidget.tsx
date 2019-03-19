import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { selectIsUserFullyVerified } from "../../../modules/auth/selectors";
import { EBankTransferType } from "../../../modules/bank-transfer-flow/reducer";
import { selectIsBankAccountVerified } from "../../../modules/bank-transfer-flow/selectors";
import { selectBankAccount } from "../../../modules/kyc/selectors";
import { TBankAccount } from "../../../modules/kyc/types";
import { appConnect } from "../../../store";
import { DeepReadonly } from "../../../types";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Button, ButtonSize, EButtonLayout } from "../../shared/buttons";
import { Panel } from "../../shared/Panel";
import { BankAccount } from "../../wallet/BankAccount";

import * as bankIcon from "../../../assets/img/bank-transfer/bank-icon.svg";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./LinkedBankAccountWidget.module.scss";

interface IDispatchProps {
  verifyBankAccount: () => void;
}

interface IStateProps {
  bankAccount?: DeepReadonly<TBankAccount>;
  isBankAccountVerified: boolean;
  isUserFullyVerified: boolean;
}

interface IExternalProps {
  layoutClass?: string;
}

type IComponentProps = IStateProps & IDispatchProps;

const LinkAccount: React.FunctionComponent<IComponentProps> = ({
  verifyBankAccount,
  isUserFullyVerified,
}) => (
  <>
    <img className={styles.icon} src={bankIcon} alt="" />
    <Button
      onClick={verifyBankAccount}
      disabled={!isUserFullyVerified}
      data-test-id="linked-bank-account-widget.link-account"
      layout={EButtonLayout.SECONDARY}
      size={ButtonSize.SMALL}
      iconPosition="icon-after"
      svgIcon={arrowRight}
    >
      <FormattedMessage id="linked-bank-account-widget.verify" />
    </Button>
  </>
);

const LinkedBankAccountComponent: React.FunctionComponent<
  IComponentProps & IExternalProps
> = props => (
  <Panel
    headerText={<FormattedMessage id="linked-bank-account-widget.header" />}
    className={cn("h-100", props.layoutClass)}
  >
    <section className={styles.panelBody}>
      {props.isBankAccountVerified && props.bankAccount && props.bankAccount.hasBankAccount ? (
        <BankAccount details={props.bankAccount.details} />
      ) : (
        <LinkAccount {...props} />
      )}
    </section>
    {props.isBankAccountVerified && (
      <Button
        className={styles.linkButton}
        onClick={props.verifyBankAccount}
        disabled={!props.isUserFullyVerified}
        data-test-id="linked-bank-account-widget.link-different-account"
        layout={EButtonLayout.INLINE}
        size={ButtonSize.SMALL}
      >
        <FormattedMessage id="linked-bank-account-widget.link-different" />
      </Button>
    )}
  </Panel>
);

const LinkedBankAccountWidget = compose<React.FunctionComponent<IExternalProps>>(
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.loadBankAccountDetails());
    },
  }),
  appConnect<IStateProps, IDispatchProps, {}>({
    stateToProps: state => ({
      bankAccount: selectBankAccount(state),
      isBankAccountVerified: selectIsBankAccountVerified(state),
      isUserFullyVerified: selectIsUserFullyVerified(state),
    }),
    dispatchToProps: dispatch => ({
      verifyBankAccount: () =>
        dispatch(actions.bankTransferFlow.startBankTransfer(EBankTransferType.VERIFY)),
    }),
  }),
)(LinkedBankAccountComponent);

export { LinkedBankAccountWidget, LinkedBankAccountComponent };
