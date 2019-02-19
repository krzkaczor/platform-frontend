import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { IKycIndividualData, TKycBankAccount } from "../../lib/api/KycApi.interfaces";
import { InlineIcon } from "../shared/InlineIcon";

import * as bankIcon from "../../assets/img/inline_icons/bank.svg";
import * as styles from "./VerifiedBankAccount.module.scss";

interface IExternalProps {
  personalData: IKycIndividualData;
  bankAccount: TKycBankAccount;
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

const BankAccount: React.FunctionComponent<IExternalProps> = ({ personalData, bankAccount }) => (
  <div className={styles.bankDetails}>
    <div className={styles.icon}>
      <InlineIcon svgIcon={bankIcon} />
    </div>
    <div>
      <p className={"m-0"}>
        <span className={styles.kycData}>
          {personalData.firstName} {personalData.lastName}
        </span>{" "}
        <span className={styles.bankVerified}>
          <FormattedMessage id="shared-component.wallet-verified-bank-account.bank-account.verified" />
        </span>
      </p>
      <p className={"m-0"}>
        <BankNumber last4={bankAccount.bankAccountNumberLast4} bank={""} />
      </p>
    </div>
  </div>
);

export { BankAccount };
