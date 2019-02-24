import BigNumber from "bignumber.js";
import { Formik, FormikErrors, yupToFormErrors } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";
import { compose, withHandlers } from "recompose";
import { NumberSchema } from "yup";

import * as YupTS from "../../../../lib/yup-ts";
import { actions } from "../../../../modules/actions";
import { ETxSenderType, IDraftType } from "../../../../modules/tx/interfaces";
import { EValidationState } from "../../../../modules/tx/sender/interfaces";
import { selectTxValidationState } from "../../../../modules/tx/sender/selectors";
import { selectMaxAvailableEther } from "../../../../modules/wallet/selectors";
import * as web3Interfaces from "../../../../modules/web3/interfaces";
import { doesUserHaveEnoughEther, validateAddress } from "../../../../modules/web3/utils";
import { appConnect } from "../../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../../utils/injectIntlHelpers";
import { Button } from "../../../shared/buttons";
import { SpinningEthereum } from "../../../shared/ethererum";
import { Form, FormField } from "../../../shared/forms";
import { ValidationErrorMessage } from "../shared/ValidationErrorMessage";

import { NumericString, OmitKeys } from "../../../../types";
import { convert } from "../../../eto/utils";
import * as styles from "./Withdraw.module.scss";

interface IStateProps {
  maxEther: BigNumber;
  validationState?: EValidationState;
}

// tslint:disable-next-line:no-unused-variable
interface IFormikProps {
  value: string;
  to: string;
}

interface IHandlersProps {
  onValidateHandler: (values: IFormikProps) => void | FormikErrors<IFormikProps>;
}

interface IDispatchProps {
  onValidate: (txDraft: IDraftType) => any;
  onAccept: (tx: IFormikProps) => any;
}

type TProps = IStateProps & OmitKeys<IDispatchProps, "onValidate"> & IHandlersProps;

const getWithdrawFormSchema = (maxEther: BigNumber) =>
  YupTS.object({
    to: YupTS.string().enhance(v =>
      v.test(
        "isEthereumAddress",
        (
          <FormattedMessage id="modals.tx-sender.withdraw-flow.withdraw-component.errors.not-ethereum-address" />
        ) as any,
        (value: string | undefined) => {
          // allow empty values as they should be handled by required yup validation
          if (value === undefined) {
            return true;
          }

          return validateAddress(value);
        },
      ),
    ),
    value: YupTS.number().enhance((v: NumberSchema) =>
      v
        .moreThan(0)
        .test(
          "isEnoughEther",
          (
            <FormattedMessage id="modals.tx-sender.withdraw-flow.withdraw-component.errors.value-higher-than-balance" />
          ) as any,
          (value: string) => doesUserHaveEnoughEther(value, maxEther),
        ),
    ),
  }).toYup();

const WithdrawLayout: React.FunctionComponent<TProps & IIntlProps> = ({
  onAccept,
  onValidateHandler,
  validationState,
  intl,
}) => (
  <section>
    <SpinningEthereum />

    <h3 className={styles.title}>
      <FormattedMessage id="modal.sent-eth.title" />
    </h3>

    <Formik<IFormikProps>
      validate={onValidateHandler}
      initialValues={{ value: "", to: "" }}
      onSubmit={onAccept}
    >
      {({ isValid, isValidating }) => (
        <Form>
          <Container>
            <Row>
              <Col xs={12} className="mb-3">
                <FormField
                  name="to"
                  label={<FormattedMessage id="modal.sent-eth.to-address" />}
                  placeholder="0x0"
                  data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.to-address"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} className="mb-3">
                <FormField
                  name="value"
                  label={<FormattedMessage id="modal.sent-eth.amount-to-send" />}
                  placeholder={intl.formatIntlMessage("modal.sent-eth.eth-amount-placeholder")}
                  data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.value"
                />
                {/* @SEE https://github.com/jaredpalmer/formik/issues/288 */}
                {validationState !== EValidationState.VALIDATION_OK &&
                  isValid &&
                  !isValidating && <ValidationErrorMessage type={validationState} />}
              </Col>
            </Row>
            <Row>
              <Col xs={12} className="mt-3 text-center">
                <Button
                  type="submit"
                  disabled={
                    !isValid || isValidating || validationState !== EValidationState.VALIDATION_OK
                  }
                  data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"
                >
                  <FormattedMessage id="modal.sent-eth.button" />
                </Button>
              </Col>
            </Row>
          </Container>
        </Form>
      )}
    </Formik>
  </section>
);

const Withdraw = compose<TProps & IIntlProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      maxEther: selectMaxAvailableEther(state),
      validationState: selectTxValidationState(state),
    }),
    dispatchToProps: d => ({
      onAccept: (tx: IFormikProps) =>
        d(
          actions.txSender.txSenderAcceptDraft(convert(tx, web3Interfaces.blToStateConversionSpec)),
        ),
      onValidate: (txDraft: IDraftType) => d(actions.txValidator.txSenderValidateDraft(txDraft)),
    }),
  }),
  withHandlers<IStateProps & IDispatchProps, IHandlersProps>({
    onValidateHandler: ({ onValidate, maxEther }) => (values: IFormikProps) => {
      const schema = getWithdrawFormSchema(maxEther);

      try {
        schema.validateSync(values, { abortEarly: false });
      } catch (errors) {
        return yupToFormErrors(errors);
      }

      onValidate({
        to: values.to as NumericString,
        value: new BigNumber(values.value),
        type: ETxSenderType.WITHDRAW,
      });

      return undefined;
    },
  }),
  injectIntlHelpers,
)(WithdrawLayout);

export { Withdraw, WithdrawLayout };
