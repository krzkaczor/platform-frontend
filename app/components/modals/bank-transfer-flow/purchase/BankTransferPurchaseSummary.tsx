import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Container } from "reactstrap";
import { compose } from "recompose";

import { KycBankQuintessenceBankAccount } from "../../../../lib/api/KycApi.interfaces";
import { actions } from "../../../../modules/actions";
import {
  selectBankTransferFlowReference,
  selectBankTransferMinAmount,
} from "../../../../modules/bank-transfer-flow/selectors";
import { selectQuintessenceBankAccount } from "../../../../modules/kyc/selectors";
import { appConnect } from "../../../../store";
import { ButtonArrowRight } from "../../../shared/buttons";
import { CopyToClipboardButton } from "../../../shared/CopyToClipboardButton";
import { Heading } from "../../../shared/modals/Heading";
import { ECurrency, ECurrencySymbol, Money } from "../../../shared/Money";
import { InfoList } from "../../tx-sender/shared/InfoList";
import { InfoRow } from "../../tx-sender/shared/InfoRow";

import * as styles from "../../tx-sender/investment-flow/Summary.module.scss";

interface IStateProps {
  referenceCode: string;
  minAmount: string;
  quintessenceBankAccount: KycBankQuintessenceBankAccount;
}

interface IDispatchProps {
  continueToSuccess: () => void;
}

type IProps = IStateProps & IDispatchProps;

const CopyToClipboardLabel: React.FunctionComponent<{ label: string }> = ({ label }) => (
  <>
    &nbsp; {label}
    <CopyToClipboardButton className={cn(styles.copyToClipboard, "ml-2")} value={label} />
  </>
);

const BankTransferPurchaseLayout: React.FunctionComponent<IProps> = ({
  continueToSuccess,
  referenceCode,
  minAmount,
  quintessenceBankAccount,
}) => (
  <Container className={styles.container}>
    <Heading className="mb-4">
      <FormattedMessage id="bank-transfer.purchase.summary.title" />
    </Heading>

    <p className="mb-3">
      <FormattedHTMLMessage id="bank-transfer.purchase.summary.description" tagName="span" />
    </p>

    <InfoList className="mb-4">
      <InfoRow
        caption={<FormattedMessage id="bank-transfer.purchase.summary.min-amount" />}
        value={
          <Money value={minAmount} currency={ECurrency.EUR} currencySymbol={ECurrencySymbol.CODE} />
        }
      />
      <InfoRow
        caption={<FormattedMessage id="bank-transfer.summary.purchase-price.caption" />}
        value={<FormattedMessage id="bank-transfer.summary.purchase-price.value" />}
      />
      <InfoRow
        caption={<FormattedMessage id="bank-transfer.summary.recipient" />}
        value={<CopyToClipboardLabel label={quintessenceBankAccount.name} />}
      />
      <InfoRow
        caption={<FormattedMessage id="bank-transfer.summary.iban" />}
        value={<CopyToClipboardLabel label={quintessenceBankAccount.bankAccountNumber} />}
      />
      <InfoRow
        caption={<FormattedMessage id="bank-transfer.summary.bic" />}
        value={<CopyToClipboardLabel label={quintessenceBankAccount.swiftCode} />}
      />
      <InfoRow
        caption={<FormattedMessage id="bank-transfer.summary.reference-number" />}
        value={<CopyToClipboardLabel label={referenceCode} />}
      />
    </InfoList>

    <p className="text-warning mx-4">
      <FormattedMessage id="bank-transfer.purchase.summary.note" />
    </p>

    <section className="text-center">
      <ButtonArrowRight onClick={continueToSuccess}>
        <FormattedMessage id="bank-transfer.summary.transfer-completed" />
      </ButtonArrowRight>
    </section>
  </Container>
);

const BankTransferPurchaseSummary = compose<IProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => {
      const quintessenceBankAccount = selectQuintessenceBankAccount(state);

      if (!quintessenceBankAccount) {
        throw new Error("Quintessence bank account can't be undefined");
      }

      return {
        quintessenceBankAccount,
        referenceCode: selectBankTransferFlowReference(state),
        minAmount: selectBankTransferMinAmount(state),
      };
    },
    dispatchToProps: dispatch => ({
      continueToSuccess: () => dispatch(actions.bankTransferFlow.continueToSuccess()),
    }),
  }),
)(BankTransferPurchaseLayout);

export { BankTransferPurchaseLayout, BankTransferPurchaseSummary };
