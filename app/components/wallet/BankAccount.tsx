import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TKycBankAccount } from "../../lib/api/KycApi.interfaces";

import * as bankIcon from "../../assets/img/bank-transfer/bank_icon.svg";
import * as styles from "./BankAccount.module.scss";

interface IExternalProps {
  details: TKycBankAccount;
}

interface IBankNumber {
  last4: string;
  bank: string;
}

const BankNumber: React.FunctionComponent<IBankNumber> = ({ last4, bank }) => (
  <>
    {bank} ({"*".repeat(16)}
    {last4})
  </>
);

const BankAccount: React.FunctionComponent<IExternalProps> = ({ details }) => (
  <section className={styles.bankDetails}>
    <img className={styles.icon} src={bankIcon} />
    <div>
      <p className={"m-0"}>
        <span className={styles.kycData}>{details.holderName}</span>{" "}
        <span className={styles.bankVerified}>
          <FormattedMessage id="shared-component.wallet-verified-bank-account.bank-account.verified" />
        </span>
      </p>
      <p className={"m-0"}>
        <BankNumber last4={details.bankAccountNumberLast4} bank={""} />
      </p>
    </div>
  </section>
);

export { BankAccount };
