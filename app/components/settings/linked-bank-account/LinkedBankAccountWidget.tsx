import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../modules/actions";
import { EBankTransferType } from "../../../modules/bank-transfer-flow/reducer";
import { selectIsBankAccountVerified } from "../../../modules/bank-transfer-flow/selectors";
import { selectBankAccount } from "../../../modules/kyc/selectors";
import { TBankAccount } from "../../../modules/kyc/types";
import { appConnect } from "../../../store";
import { DeepReadonly } from "../../../types";
import { Button, ButtonSize, EButtonLayout } from "../../shared/buttons";
import { Panel } from "../../shared/Panel";
import { BankAccount } from "../../wallet/BankAccount";

import * as bankIcon from "../../../assets/img/bank-transfer/bank_icon.svg";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./LinkedBankAccountWidget.module.scss";

interface IDispatchProps {
  verifyBankAccount: () => void;
}

interface IStateProps {
  bankAccount?: DeepReadonly<TBankAccount>;
  isVerified: boolean;
}

type IComponentProps = IStateProps & IDispatchProps;

const LinkAccount: React.FunctionComponent<IDispatchProps> = ({ verifyBankAccount }) => (
  <>
    <img className={styles.icon} src={bankIcon} />
    <Button
      onClick={() => verifyBankAccount()}
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

const LinkedBankAccountComponent: React.FunctionComponent<IComponentProps> = ({
  isVerified,
  bankAccount,
  verifyBankAccount,
}) => (
  <Panel
    centerContent={false}
    headerText={<FormattedMessage id="linked-bank-account-widget.header" />}
  >
    <section className={styles.panelBody}>
      {isVerified && bankAccount && bankAccount.hasBankAccount ? (
        <>
          <BankAccount details={bankAccount.details} />
        </>
      ) : (
        <LinkAccount verifyBankAccount={verifyBankAccount} />
      )}
    </section>
    {isVerified && (
      <Button
        className={styles.linkButton}
        onClick={() => verifyBankAccount()}
        data-test-id="linked-bank-account-widget.link-different-account"
        layout={EButtonLayout.INLINE}
        size={ButtonSize.SMALL}
      >
        <FormattedMessage id="linked-bank-account-widget.link-different" />
      </Button>
    )}
  </Panel>
);

const LinkedBankAccountWidget = appConnect<IStateProps, IDispatchProps, {}>({
  stateToProps: state => ({
    bankAccount: selectBankAccount(state),
    isVerified: selectIsBankAccountVerified(state),
  }),
  dispatchToProps: dispatch => ({
    verifyBankAccount: () =>
      dispatch(actions.bankTransferFlow.startBankTransfer(EBankTransferType.VERIFY)),
  }),
})(LinkedBankAccountComponent);

export { LinkedBankAccountWidget, LinkedBankAccountComponent };
