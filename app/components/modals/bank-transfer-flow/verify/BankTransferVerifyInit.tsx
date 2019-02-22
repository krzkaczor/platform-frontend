import { Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent, StateHandler, withStateHandlers } from "recompose";

import { externalRoutes } from "../../../../config/externalRoutes";
import * as YupTS from "../../../../lib/yup-ts";
import { actions } from "../../../../modules/actions";
import { selectBankTransferMinAmount } from "../../../../modules/bank-transfer-flow/selectors";
import { appConnect } from "../../../../store";
import { Button, ButtonArrowRight, EButtonLayout } from "../../../shared/buttons";
import { ECheckboxLayout, Form, FormFieldBoolean } from "../../../shared/forms";
import { ExternalLink } from "../../../shared/links";
import { ECurrency, Money } from "../../../shared/Money";
import { SectionHeader } from "../../../shared/SectionHeader";
import { Message } from "../../Message";

import * as bankVaultIcon from "../../../../assets/img/bank-transfer/bankvault.svg";

export enum EBankTransferInitState {
  INFO,
  AGREEMENT,
}

interface IStateProps {
  minEuroUlps: string;
}

interface IDispatchProps {
  goToSummary: () => void;
  downloadNEurTokenAgreement: () => void;
}

interface ILocalState {
  state: EBankTransferInitState;
}

type ILocalStateUpdater = {
  goToAgreement: StateHandler<ILocalState>;
};

type IProps = IStateProps & IDispatchProps & ILocalStateUpdater;

const AgreementScheme = YupTS.object({
  quintessenceTosApproved: YupTS.onlyTrue(),
  nEurTosApproved: YupTS.onlyTrue(),
});

type TAgreementForm = YupTS.TypeOf<typeof AgreementScheme>;

const BankTransferVerifyAgreementLayout: React.FunctionComponent<IProps> = ({
  goToSummary,
  downloadNEurTokenAgreement,
}) => (
  <section className="text-center">
    <SectionHeader
      className="mb-3"
      decorator={false}
      description={<ExternalLink href={externalRoutes.quintessenseLanding} />}
    >
      <FormattedMessage id="bank-verification.agreement.title" />
    </SectionHeader>

    <p className="mb-3">
      <FormattedMessage id="bank-verification.agreement.text" />
    </p>

    <small className="d-inline-block mb-3 mx-4">
      <FormattedMessage id="bank-verification.agreement.note" />
    </small>

    <Formik<TAgreementForm>
      validationSchema={AgreementScheme.toYup()}
      initialValues={{ quintessenceTosApproved: false, nEurTosApproved: false }}
      onSubmit={goToSummary}
    >
      {({ isValid }) => (
        <Form className="d-inline-block">
          <FormFieldBoolean
            className="mb-3"
            layout={ECheckboxLayout.BLOCK}
            label={
              <>
                <FormattedMessage id="bank-verification.agreement.terms-and-conditions.label" />
                <br />
                <small>
                  <ExternalLink
                    onClick={e => {
                      // Stop propagation, otherwise checkbox is going to be automatically checked
                      e.stopPropagation();
                    }}
                    href={externalRoutes.quintessenseTermsOfUse}
                  >
                    <FormattedMessage id="bank-verification.agreement.terms-and-conditions.download" />
                  </ExternalLink>
                </small>
              </>
            }
            name="quintessenceTosApproved"
          />
          <FormFieldBoolean
            className="mb-3"
            layout={ECheckboxLayout.BLOCK}
            label={
              <>
                <FormattedMessage id="bank-verification.agreement.neur-purchase-agreement.label" />
                <br />
                <small>
                  <Button
                    layout={EButtonLayout.INLINE}
                    onClick={e => {
                      // Stop propagation, otherwise checkbox is going to be automatically checked
                      e.stopPropagation();
                      downloadNEurTokenAgreement();
                    }}
                  >
                    <FormattedMessage id="bank-verification.agreement.neur-purchase-agreement.download" />
                  </Button>
                </small>
              </>
            }
            name="nEurTosApproved"
          />
          <ButtonArrowRight type="submit" disabled={!isValid}>
            <FormattedMessage id="bank-verification.agreement.continue" />
          </ButtonArrowRight>
        </Form>
      )}
    </Formik>
  </section>
);

const BankTransferVerifyInfoLayout: React.FunctionComponent<IProps> = ({
  goToAgreement,
  minEuroUlps,
}) => (
  <Message
    image={<img src={bankVaultIcon} alt="" className="mb-3" />}
    title={<FormattedMessage id="bank-verification.info.title" />}
    text={
      <FormattedMessage
        id="bank-verification.info.text"
        values={{ min: <Money value={minEuroUlps} currency={ECurrency.EUR} /> }}
      />
    }
  >
    <ButtonArrowRight onClick={goToAgreement}>
      <FormattedMessage id="bank-verification.info.link-now" />
    </ButtonArrowRight>
  </Message>
);

const BankTransferVerifyInit = compose<IProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      minEuroUlps: selectBankTransferMinAmount(state),
    }),
    dispatchToProps: dispatch => ({
      goToSummary: () => dispatch(actions.bankTransferFlow.continueProcessing()),
      downloadNEurTokenAgreement: () =>
        dispatch(actions.bankTransferFlow.downloadNEurTokenAgreement()),
    }),
  }),
  withStateHandlers<ILocalState, ILocalStateUpdater>(
    {
      state: EBankTransferInitState.INFO,
    },
    {
      goToAgreement: () => () => ({
        state: EBankTransferInitState.AGREEMENT,
      }),
    },
  ),
  branch<ILocalState>(
    props => props.state === EBankTransferInitState.INFO,
    renderComponent(BankTransferVerifyInfoLayout),
  ),
)(BankTransferVerifyAgreementLayout);

export { BankTransferVerifyInit, BankTransferVerifyInfoLayout, BankTransferVerifyAgreementLayout };
