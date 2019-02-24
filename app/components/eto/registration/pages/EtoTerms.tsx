import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { etoFormIsReadonly } from "../../../../lib/api/eto/EtoApiUtils";
import { actions } from "../../../../modules/actions";
import { EEtoFormTypes } from "../../../../modules/eto-flow/interfaces/interfaces";
import {IBlPublicEtoData} from "../../../../modules/eto-flow/interfaces/PublicEtoData";
import { selectIssuerEto, selectIssuerEtoState } from "../../../../modules/eto-flow/selectors";
import { EtoTermsValidator} from "../../../../modules/public-etos/validators";
import { appConnect } from "../../../../store";
import {DeepPartial, TTranslatedString} from "../../../../types";
import { Button, EButtonLayout } from "../../../shared/buttons";
import {
  FormField,
  FormFieldBoolean,
  FormFieldError,
  FormRadioButton,
  FormTextArea,
} from "../../../shared/forms";
import {
  FormFieldCheckbox,
  FormFieldCheckboxGroup,
} from "../../../shared/forms/fields/FormFieldCheckboxGroup";
import { FormFieldLabel } from "../../../shared/forms/fields/FormFieldLabel";
import { FormRange } from "../../../shared/forms/fields/FormRange";
import { convert, parseStringToInteger } from "../../utils";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

import * as styles from "../Shared.module.scss";

interface IExternalProps {
  readonly: boolean;
}

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: DeepPartial<IBlPublicEtoData>;
}

interface IDispatchProps {
  saveData: (values: DeepPartial<IBlPublicEtoData>) => void;
}

type IProps = IExternalProps & IStateProps & IDispatchProps & FormikProps<DeepPartial<IBlPublicEtoData>>;

interface ICurrencies {
  [key: string]: string;
}

const CURRENCIES: ICurrencies = {
  eth: "ETH",
  eur_t: "nEUR",
};

const MIN_NON_RETAIL_TICKET = 100000;

const currencies = Object.keys(CURRENCIES);

const EtoRegistrationTermsComponent: React.FunctionComponent<IProps> = ({
  readonly,
  savingData,
}) => {
  return (
    <EtoFormBase
      title={<FormattedMessage id="eto.form.eto-terms.title" />}
      validator={EtoTermsValidator.toYup()}
    >
      <Section>
        <div className="form-group">
          <FormFieldLabel name="allowRetailInvestors">
            <FormattedMessage id="eto.form.section.eto-terms.allow-retail-label" />
          </FormFieldLabel>
          <div>
            <FormRadioButton
              disabled={readonly}
              name="allowRetailInvestors"
              label={<FormattedMessage id="eto.form.section.eto-terms.is-hnwi-eto" />}
              value={false}
            />
          </div>
          <div>
            <FormRadioButton
              disabled={readonly}
              name="allowRetailInvestors"
              label={<FormattedMessage id="eto.form.section.eto-terms.is-retail-eto" />}
              value={true}
            />
          </div>
        </div>

        <div className="form-group">
          <FormFieldBoolean
            disabled={readonly}
            name="notUnderCrowdfundingRegulations"
            label={<FormattedMessage id="eto.form.section.eto-terms.is-not-crowdfunding" />}
          />
        </div>

        <div className="form-group">
          <FormFieldCheckboxGroup
            name="currencies"
            label={<FormattedMessage id="eto.form.section.eto-terms.fundraising-currency" />}
          >
            {currencies.map(currency => (
              <FormFieldCheckbox
                key={currency}
                label={CURRENCIES[currency]}
                value={currency}
                disabled={readonly}
              />
            ))}
          </FormFieldCheckboxGroup>
        </div>

        <Row>
          <Col>
            <FormField
              label={<FormattedMessage id="eto.form.section.eto-terms.minimum-ticket-size" />}
              placeholder="1"
              prefix="€"
              name="minTicketEur"
              type="number"
              disabled={readonly}
            />
          </Col>
          <Col>
            <FormField
              label={<FormattedMessage id="eto.form.section.eto-terms.maximum-ticket-size" />}
              placeholder="Unlimited"
              prefix="€"
              name="maxTicketEur"
              type="number"
              disabled={readonly}
            />
          </Col>
        </Row>

        <div className="form-group">
          <FormFieldLabel name="prospectusLanguage">
            <FormattedMessage id="eto.form.section.eto-terms.prospectus-language" />
          </FormFieldLabel>
          <div>
            <FormRadioButton name="prospectusLanguage" label="DE" value="de" disabled={readonly} />
          </div>
          <div>
            <FormRadioButton name="prospectusLanguage" label="EN" value="en" disabled={readonly} />
          </div>
          <FormFieldError alignLeft name="prospectusLanguage" />
        </div>

        <div className="form-group">
          <FormFieldLabel name="whitelistDurationDays">
            <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration" />
          </FormFieldLabel>
          <FormRange
            disabled={readonly}
            name="whitelistDurationDays"
            unitMin={
              <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-min" />
            }
            unitMax={
              <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-max" />
            }
          />
        </div>

        <div className="form-group">
          <FormFieldLabel name="publicDurationDays">
            <FormattedMessage id="eto.form.section.eto-terms.public-offer-duration" />
          </FormFieldLabel>
          <FormRange
            disabled={readonly}
            name="publicDurationDays"
            unit={<FormattedMessage id="eto.form.section.eto-terms.public-offer-duration.unit" />}
          />
        </div>

        <div className="form-group">
          <FormFieldLabel name="signingDurationDays">
            <FormattedMessage id="eto.form.section.eto-terms.signing-duration" />
          </FormFieldLabel>
          <FormRange
            disabled={readonly}
            name="signingDurationDays"
            unit={<FormattedMessage id="eto.form.section.eto-terms.signing-duration.unit" />}
          />
        </div>

        <div className="form-group">
          <FormFieldLabel name="enableTransferOnSuccess">
            <FormattedMessage id="eto.form.section.eto-terms.token-tradable" />
          </FormFieldLabel>
          <div>
            <FormRadioButton
              disabled={readonly}
              name="enableTransferOnSuccess"
              label={<FormattedMessage id="form.select.enabled" />}
              value={true}
            />
          </div>
          <div>
            <FormRadioButton
              disabled={readonly}
              name="enableTransferOnSuccess"
              label={<FormattedMessage id="form.select.disabled" />}
              value={false}
            />
          </div>
          <FormFieldError name="enableTransferOnSuccess" alignLeft />
        </div>

        <FormTextArea
          disabled={readonly}
          className="mb-2 mt-2"
          label={<FormattedMessage id="eto.form.additional-terms" />}
          name="additionalTerms"
        />
      </Section>

      {!readonly && (
        <Section className={styles.buttonSection}>
          <Button
            layout={EButtonLayout.PRIMARY}
            type="submit"
            isLoading={savingData}
            data-test-id="eto-registration-eto-terms-submit"
          >
            <FormattedMessage id="form.button.save" />
          </Button>
        </Section>
      )}
    </EtoFormBase>
  );
};

const EtoRegistrationTerms = compose<React.FunctionComponent<IExternalProps>>(
  setDisplayName(EEtoFormTypes.EtoTerms),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: selectIssuerEto(s) as DeepPartial<IBlPublicEtoData>,
      readonly: etoFormIsReadonly(EEtoFormTypes.EtoTerms, selectIssuerEtoState(s)),
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: DeepPartial<IBlPublicEtoData>) => {
        const convertedData = convert(data, fromFormState);
        dispatch(
          actions.etoFlow.saveDataStart({
            companyData: {},
            etoData: convertedData,
          }),
        );
      },
    }),
  }),
  withFormik<IStateProps & IDispatchProps, DeepPartial<IBlPublicEtoData>>({
    validationSchema: EtoTermsValidator.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
    validate: values => {
      const errors: { -readonly [P in keyof (typeof values)]: TTranslatedString } = {};

      if (values.allowRetailInvestors && values.enableTransferOnSuccess) {
        errors.enableTransferOnSuccess = (
          <FormattedMessage id="eto.form.eto-terms.errors.transfer-not-allowed-for-retail-eto" />
        );
      }

      if (!values.allowRetailInvestors && (values.minTicketEur || 0) < MIN_NON_RETAIL_TICKET) {
        errors.minTicketEur = (
          <FormattedMessage
            id="eto.form.eto-terms.errors.to-low-min-ticket-for-non-retail-eto"
            values={{ minTicket: MIN_NON_RETAIL_TICKET }}
          />
        );
      }

      return errors;
    },
  }),
)(EtoRegistrationTermsComponent);

const fromFormState = {
  publicDurationDays: parseStringToInteger(),
  signingDurationDays: parseStringToInteger(),
  whitelistDurationDays: parseStringToInteger(),
};

export { EtoRegistrationTerms, EtoRegistrationTermsComponent };
