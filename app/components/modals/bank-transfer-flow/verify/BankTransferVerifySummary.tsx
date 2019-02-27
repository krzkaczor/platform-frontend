import * as cn from "classnames";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Container } from "reactstrap";
import { compose, withProps } from "recompose";

import { getConfig } from "../../../../config/getConfig";
import { actions } from "../../../../modules/actions";
import {
  selectBankTransferFlowReference,
  selectBankTransferMinAmount,
} from "../../../../modules/bank-transfer-flow/selectors";
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
}

interface IWithProps {
  recipient: string;
  iban: string;
  bic: string;
}

interface IDispatchProps {
  continueToSummary: () => void;
}

type IProps = IStateProps & IDispatchProps & IWithProps;

const CopyToClipboardLabel: React.FunctionComponent<{ label: string }> = ({ label }) => (
  <>
    &nbsp; {label}
    <CopyToClipboardButton className={cn(styles.copyToClipboard, "ml-2")} value={label} />
  </>
);

const BankTransferVerifySummaryLayout: React.FunctionComponent<IProps> = ({
  recipient,
  bic,
  iban,
  continueToSummary,
  referenceCode,
  minAmount,
}) => (
  <Container className={styles.container}>
    <Heading className="mb-4">
      <FormattedMessage id="bank-transfer.verify.summary.title" />
    </Heading>

    <p className="mb-3">
      <FormattedHTMLMessage id="bank-transfer.verify.summary.description" tagName="span" />
    </p>

    <InfoList className="mb-4">
      <InfoRow
        data-test-id="bank-transfer.summary.amount"
        caption={<FormattedMessage id="bank-transfer.verify.summary.min-amount" />}
        value={
          <Money
            value={minAmount}
            currency={ECurrency.EUR}
            currencySymbol={ECurrencySymbol.SYMBOL}
          />
        }
      />
      <InfoRow
        caption={<FormattedMessage id="bank-transfer.summary.purchase-price.caption" />}
        value={<FormattedMessage id="bank-transfer.summary.purchase-price.value" />}
      />
      <InfoRow
        data-test-id="bank-transfer.summary.recipient"
        caption={<FormattedMessage id="bank-transfer.summary.recipient" />}
        value={<CopyToClipboardLabel label={recipient} />}
      />
      <InfoRow
        data-test-id="bank-transfer.summary.iban"
        caption={<FormattedMessage id="bank-transfer.summary.iban" />}
        value={<CopyToClipboardLabel label={iban} />}
      />
      <InfoRow
        data-test-id="bank-transfer.summary.bic"
        caption={<FormattedMessage id="bank-transfer.summary.bic" />}
        value={<CopyToClipboardLabel label={bic} />}
      />
      <InfoRow
        data-test-id="bank-transfer.summary.reference-number"
        caption={<FormattedMessage id="bank-transfer.summary.reference-number" />}
        value={<CopyToClipboardLabel label={referenceCode} />}
      />
    </InfoList>

    <p className="text-warning mx-4">
      <FormattedMessage id="bank-transfer.verify.summary.note" />
    </p>

    <section className="text-center">
      <ButtonArrowRight
        onClick={continueToSummary}
        data-test-id="bank-transfer.summary.transfer-completed"
      >
        <FormattedMessage id="bank-transfer.summary.transfer-completed" />
      </ButtonArrowRight>
    </section>
  </Container>
);

const BankTransferVerifySummary = compose<IProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      referenceCode: selectBankTransferFlowReference(state),
      minAmount: selectBankTransferMinAmount(state),
    }),
    dispatchToProps: dispatch => ({
      continueToSummary: () => dispatch(actions.bankTransferFlow.continueToSummary()),
    }),
  }),
  withProps<IWithProps, {}>(() => {
    const { bankTransferDetails } = getConfig(process.env);

    return {
      recipient: bankTransferDetails.recipient,
      iban: bankTransferDetails.iban,
      bic: bankTransferDetails.bic,
    };
  }),
)(BankTransferVerifySummaryLayout);

export { BankTransferVerifySummaryLayout, BankTransferVerifySummary };