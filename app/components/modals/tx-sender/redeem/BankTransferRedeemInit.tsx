import { FormikConsumer, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { ITxData } from "../../../../lib/web3/types";
import * as YupTS from "../../../../lib/yup-ts";
import { actions } from "../../../../modules/actions";
import { EBankTransferType } from "../../../../modules/bank-transfer-flow/reducer";
import {
  selectBankFeeUlps,
  selectBankTransferMinAmount,
} from "../../../../modules/bank-transfer-flow/selectors";
import { selectLiquidEuroTokenBalance } from "../../../../modules/wallet/selectors";
import { doesUserHaveEnoughNEuro, doesUserWithdrawMinimal } from "../../../../modules/web3/utils";
import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { Button, ButtonSize, EButtonLayout } from "../../../shared/buttons/Button";
import { ButtonArrowRight } from "../../../shared/buttons/index";
import { FormField } from "../../../shared/forms/fields/FormField";
import { Form } from "../../../shared/forms/Form";
import { Heading } from "../../../shared/modals/Heading";
import { ECurrency, EMoneyFormat, getFormattedMoney } from "../../../shared/Money";
import { MoneySuiteWidget } from "../../../shared/MoneySuiteWidget";
import { ESectionHeaderSize, SectionHeader } from "../../../shared/SectionHeader";
import { VerifiedBankAccount } from "../../../wallet/VerifiedBankAccount";
import { CalculatedFee } from "./CalculatedFee";
import { TotalRedeemed } from "./TotalRedeemed";

import * as neuroIcon from "../../../../assets/img/nEUR_icon.svg";
import * as styles from "./BankTransferRedeemInit.module.scss";

interface IStateProps {
  minAmount: string;
  neuroAmount: string;
  neuroEuroAmount: string;
  bankFee: string;
}

interface IDispatchProps {
  confirm: (tx: Partial<ITxData>) => void;
  verifyBankAccount: () => void;
}

type IProps = IStateProps & IDispatchProps;

export interface IReedemData {
  amount: string;
}

const getValidators = (minAmount: string, neuroAmount: string) =>
  YupTS.object({
    amount: YupTS.number().enhance(v =>
      v
        .moreThan(0)
        .test(
          "isEnoughNEuro",
          (
            <FormattedMessage id="bank-transfer.redeem.init.errors.value-higher-than-balance" />
          ) as any,
          (value: string) => doesUserHaveEnoughNEuro(value, neuroAmount),
        )
        .test(
          "isMinimal",
          (
            <FormattedMessage id="bank-transfer.redeem.init.errors.value-lower-than-minimal" />
          ) as any,
          (value: string) => doesUserWithdrawMinimal(value, minAmount),
        ),
    ),
  }).toYup();

const BankTransferRedeemLayout: React.FunctionComponent<IProps> = ({
  neuroAmount,
  neuroEuroAmount,
  verifyBankAccount,
  bankFee,
}) => (
  <>
    <Heading className="mb-4">
      <FormattedMessage id="bank-transfer.redeem.init.title" />
    </Heading>

    <p className="mb-3">
      <FormattedHTMLMessage id="bank-transfer.redeem.init.description" tagName="span" />
    </p>

    <section className={styles.section}>
      <SectionHeader decorator={false} size={ESectionHeaderSize.SMALL}>
        <FormattedMessage id="bank-transfer.redeem.init.neur-balance" />
      </SectionHeader>
    </section>

    <section className={styles.section}>
      <MoneySuiteWidget
        icon={neuroIcon}
        currency={ECurrency.EUR_TOKEN}
        currencyTotal={ECurrency.EUR}
        largeNumber={neuroAmount}
        value={neuroEuroAmount}
        theme={"framed"}
        walletName={<FormattedMessage id="bank-transfer.redeem.init.wallet-name" />}
      />
    </section>

    <FormikConsumer>
      {({ values, setFieldValue, isValid, setFieldTouched }: FormikProps<IReedemData>) => (
        <>
          <section className={styles.section}>
            <SectionHeader decorator={false} size={ESectionHeaderSize.SMALL}>
              <FormattedMessage id="bank-transfer.redeem.init.redeem-amount" />
            </SectionHeader>
            <Button
              className={styles.linkButton}
              onClick={() => {
                setFieldValue(
                  "amount",
                  getFormattedMoney(neuroAmount, ECurrency.EUR, EMoneyFormat.WEI),
                  true,
                );
                setFieldTouched("amount", true, true);
              }}
              layout={EButtonLayout.INLINE}
              size={ButtonSize.SMALL}
            >
              <FormattedMessage id="bank-transfer.redeem.init.entire-wallet" />
            </Button>
          </section>

          <Form>
            <FormField
              name="amount"
              placeholder={`€ ${getFormattedMoney(neuroAmount, ECurrency.EUR, EMoneyFormat.WEI)}`}
            />
            <section className={styles.section}>
              <SectionHeader decorator={false} size={ESectionHeaderSize.SMALL}>
                <FormattedMessage id="bank-transfer.redeem.init.redeem-fee" />
              </SectionHeader>

              <span className="text-warning">
                {"-"} <CalculatedFee bankFee={bankFee} amount={values.amount} />
              </span>
            </section>
            <section className={styles.section}>
              <SectionHeader decorator={false} size={ESectionHeaderSize.SMALL}>
                <FormattedMessage id="bank-transfer.redeem.init.total-reedemed" />
              </SectionHeader>
              <span className="text-success">
                <TotalRedeemed bankFee={bankFee} amount={values.amount} />
              </span>
            </section>
            <VerifiedBankAccount
              className="w-100 mb-3"
              withBorder={true}
              onVerify={verifyBankAccount}
            />
            <p className="text-warning mx-4 text-center">
              <FormattedMessage id="bank-transfer.redeem.init.note" />
            </p>
            <section className="text-center">
              <ButtonArrowRight disabled={!isValid} type="submit">
                <FormattedMessage id="bank-transfer.redeem.init.continue" />
              </ButtonArrowRight>
            </section>
          </Form>
        </>
      )}
    </FormikConsumer>
  </>
);

const BankTransferRedeemInit = compose<IProps, {}>(
  onEnterAction({
    actionCreator: d => {
      d(actions.bankTransferFlow.getRedeemData());
    },
  }),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      neuroAmount: selectLiquidEuroTokenBalance(state.wallet),
      neuroEuroAmount: selectLiquidEuroTokenBalance(state.wallet),
      bankFee: selectBankFeeUlps(state),
      minAmount: selectBankTransferMinAmount(state),
    }),
    dispatchToProps: dispatch => ({
      verifyBankAccount: () =>
        dispatch(actions.bankTransferFlow.startBankTransfer(EBankTransferType.VERIFY)),
      confirm: (tx: Partial<ITxData>) => dispatch(actions.txSender.txSenderAcceptDraft(tx)),
    }),
  }),
  withFormik<IStateProps & IDispatchProps, IReedemData>({
    validationSchema: (props: IStateProps) => getValidators(props.minAmount, props.neuroAmount),
    handleSubmit: (values, { props }) => {
      props.confirm({
        value: values.amount,
      });
    },
  }),
)(BankTransferRedeemLayout);

export { BankTransferRedeemLayout, BankTransferRedeemInit, TotalRedeemed, CalculatedFee };