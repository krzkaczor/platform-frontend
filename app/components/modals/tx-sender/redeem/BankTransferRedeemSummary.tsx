import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Container } from "reactstrap";
import { compose } from "recompose";

import { actions } from "../../../../modules/actions";
import { selectBankFeeUlps } from "../../../../modules/bank-transfer-flow/selectors";
import { selectBankAccount } from "../../../../modules/kyc/selectors";
import { TBankAccount } from "../../../../modules/kyc/types";
import { selectTxSummaryAdditionalData } from "../../../../modules/tx/sender/selectors";
import { appConnect } from "../../../../store";
import { DeepReadonly } from "../../../../types";
import { ButtonArrowRight } from "../../../shared/buttons/Button";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { ECurrency, ECurrencySymbol, EMoneyFormat, Money } from "../../../shared/Money";
import { BankNumber } from "../../../wallet/BankAccount";
import { InfoList } from "../shared/InfoList";
import { InfoRow } from "../shared/InfoRow";
import { CalculatedFee } from "./CalculatedFee";
import { TotalRedeemed } from "./TotalRedeemed";

import * as styles from "../investment-flow/Summary.module.scss";

interface IStateProps {
  amount: string;
  bankFee: string;
  bankAccount: DeepReadonly<TBankAccount>;
}

interface IDispatchProps {
  confirm: () => void;
}

type IComponentProps = IDispatchProps & IStateProps;

const BankTransferRedeemSummaryLayout: React.FunctionComponent<IComponentProps> = ({
  confirm,
  bankAccount,
  amount,
  bankFee,
}) => (
  <Container className={styles.container}>
    <Heading size={EHeadingSize.SMALL} level={4} className="mb-4">
      <FormattedMessage id="bank-transfer.redeem.summary.title" />
    </Heading>

    <InfoList className="mb-4">
      <InfoRow
        caption={<FormattedMessage id="bank-transfer.redeem.summary.to-bank-account" />}
        value={
          bankAccount.hasBankAccount && (
            <BankNumber
              last4={bankAccount.details.bankAccountNumberLast4}
              bank={bankAccount.details.bankName}
            />
          )
        }
      />
      <InfoRow
        caption={<FormattedMessage id="bank-transfer.redeem.summary.return-amount" />}
        value={
          <Money
            format={EMoneyFormat.FLOAT}
            value={amount}
            currencySymbol={ECurrencySymbol.CODE}
            currency={ECurrency.EUR}
          />
        }
      />
      <InfoRow
        caption={<FormattedMessage id="bank-transfer.redeem.summary.bank-fee" />}
        value={<CalculatedFee bankFee={bankFee} amount={amount} />}
      />
      <InfoRow
        caption={<FormattedMessage id="bank-transfer.redeem.summary.total-return-amount" />}
        value={<TotalRedeemed bankFee={bankFee} amount={amount} />}
      />
    </InfoList>

    <p className="text-warning mx-4 text-center">
      <FormattedMessage id="bank-transfer.redeem.summary.note" />
    </p>

    <section className="text-center">
      <ButtonArrowRight onClick={confirm}>
        <FormattedMessage id="bank-transfer.redeem.summary.continue" />
      </ButtonArrowRight>
    </section>
  </Container>
);

const BankTransferRedeemSummary = compose<IComponentProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const txSummaryData = selectTxSummaryAdditionalData(state);
      return {
        amount: txSummaryData.amount,
        bankAccount: selectBankAccount(state)!,
        bankFee: selectBankFeeUlps(state),
      };
    },
    dispatchToProps: dispatch => ({
      confirm: () => dispatch(actions.txSender.txSenderAccept()),
    }),
  }),
)(BankTransferRedeemSummaryLayout);

export { BankTransferRedeemSummaryLayout, BankTransferRedeemSummary };
