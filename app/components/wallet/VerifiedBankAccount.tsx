import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { selectIsBankAccountVerified } from "../../modules/auth/selectors";
import { selectBankAccount } from "../../modules/kyc/selectors";
import { TBankAccount } from "../../modules/kyc/types";
import { appConnect } from "../../store";
import { DeepReadonly } from "../../types";
import { Button, EButtonLayout } from "../shared/buttons";
import { BankAccount } from "./BankAccount";

import * as styles from "./VerifiedBankAccount.module.scss";

interface IStateProps {
  bankAccount?: DeepReadonly<TBankAccount>;
  isVerified: boolean;
}

type IComponentProps = IStateProps;

const VerifiedBankAccountComponent: React.FunctionComponent<IComponentProps> = ({
  isVerified,
  bankAccount,
}) => (
  <section>
    <div className={styles.header}>
      <h4 className={styles.title}>
        <FormattedMessage id="shared-component.wallet-verified-bank-account.title" />
      </h4>
      <Button
        className={styles.linkButton}
        onClick={() => {}}
        data-test-id="wallet-verified-bank-account.link-account"
        layout={EButtonLayout.INLINE}
      >
        <FormattedMessage id="shared-component.wallet-verified-bank-account.link-account" />
      </Button>
    </div>

    {isVerified && bankAccount && bankAccount.hasBankAccount ? (
      <BankAccount details={bankAccount.details} />
    ) : (
      <span className={styles.bankNotVerified}>
        <FormattedMessage id="shared-component.wallet-verified-bank-account.bank-account" />
        <br />
        <FormattedMessage id="shared-component.wallet-verified-bank-account.bank-account.not-verified" />
      </span>
    )}
  </section>
);

const VerifiedBankAccount = compose<IComponentProps, {}>(
  appConnect<IStateProps, {}, {}>({
    stateToProps: state => ({
      bankAccount: selectBankAccount(state),
      isVerified: selectIsBankAccountVerified(state),
    }),
  }),
)(VerifiedBankAccountComponent);

export { VerifiedBankAccount, VerifiedBankAccountComponent };
