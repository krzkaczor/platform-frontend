import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { appConnect } from "../../../../store";
import { onEnterAction } from "../../../../utils/OnEnterAction";
import { FormField, FormSelectField, FormTextArea } from "../../../shared/forms/forms";

import { EtoTermsType, TPartialCompanyEtoData } from "../../../../lib/api/EtoApi.interfaces";
import { actions } from "../../../../modules/actions";
import { Button } from "../../../shared/Buttons";
import { FormCheckbox, FormRadioButton } from "../../../shared/forms/formField/FormCheckbox";
import { FormLabel } from "../../../shared/forms/formField/FormLabel";
import { FormRange } from "../../../shared/forms/formField/FormRange";
import { FormSingleFileUpload } from "../../../shared/forms/formField/FormSingleFileUpload";
import { FormHighlightGroup } from "../../../shared/forms/FormHighlightGroup";
import { FormSection } from "../../../shared/forms/FormSection";
import { Toggle } from "../../../shared/Toggle";
import { EtoFormBase } from "../EtoFormBase";

const TOKEN_HOLDERS_RIGHTS = {
  "1": "Nominee",
  "2": "Neumini UG",
  "3": "Other",
};

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoForm = (props: FormikProps<TPartialCompanyEtoData> & IProps) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.eto-terms.title" />}
    validator={EtoTermsType.toYup()}
  >
    <FormSection title={<FormattedMessage id="eto.form.section.equity-token-information.title" />}>
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.token-name" />}
        placeholder="Token name"
        name="equityTokenName"
      />
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />}
        placeholder="3 - 4 characters"
        maxlength="4"
        pattern=".{3,4}"
        name="equityTokenSymbol"
      />
      <div className="form-group">
        <FormLabel>
          <FormattedMessage id="eto.form.section.equity-token-information.token-image" />
        </FormLabel>
        <FormSingleFileUpload
          label={<FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />}
          name="equityTokenImage"
          acceptedFiles="image/png"
          fileFormatInformation="*200 x 150px png"
        />
      </div>
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.tokens-per-share" />}
        placeholder="1000000"
        name="equityTokensPerShare"
        disabled
      />
    </FormSection>

    <FormSection title={<FormattedMessage id="eto.form.section.investment-terms.title" />}>
      <FormField
        label={
          <FormattedMessage id="eto.form.section.investment-terms.fully-diluted-pre-money-valuation" />
        }
        placeholder=" "
        prefix="€"
        name="fullyDilutedPreMoneyValuationEur"
      />
      <FormField
        label={<FormattedMessage id="eto.form.section.investment-terms.existing-shares" />}
        placeholder="Number of existing shares"
        name="existingCompanyShares"
      />
      <FormField
        label={
          <FormattedMessage id="eto.form.section.investment-terms.minimum-new-shares-to-issue" />
        }
        placeholder="Number of share"
        name="newSharesToIssue"
      />
      <FormHighlightGroup>
        <FormField
          label={<FormattedMessage id="eto.form.section.investment-terms.new-share-price" />}
          placeholder="1/1000000 of share price auto complete"
          name=""
          disabled
        />
        <Row>
          <Col sm={12} md={6} className="mb-4">
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.minimum-amount" />}
              prefix="€"
              placeholder="read only"
              name=""
              disabled
            />
          </Col>
          <Col sm={12} md={6} className="mb-4">
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.maximum-amount" />}
              prefix="€"
              placeholder="read only"
              name=""
              disabled
            />
          </Col>
          <Col sm={12} md={6}>
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.minimum-token-cap" />}
              prefix="€"
              placeholder="read only"
              name=""
              disabled
            />
          </Col>
          <Col sm={12} md={6}>
            <FormField
              label={<FormattedMessage id="eto.form.section.investment-terms.maximum-token-cap" />}
              prefix="€"
              placeholder="read only"
              name=""
              disabled
            />
          </Col>
        </Row>
      </FormHighlightGroup>
      <FormTextArea
        name="discountScheme"
        label={
          <FormattedMessage id="eto.form.section.investment-terms.token-discount-for-whitelisted" />
        }
        placeholder=" "
      />
      <FormField
        label={<FormattedMessage id="eto.form.section.investment-terms.share-nominal-value" />}
        placeholder="1"
        prefix="€"
        name="shareNominalValueEur"
      />
    </FormSection>

    <FormSection title={<FormattedMessage id="eto.form.section.eto-terms.title" />}>
      <FormLabel>
        <FormattedMessage id="eto.form.section.eto-terms.fundraising-currency" />
      </FormLabel>
      <div className="form-group">
        <FormRadioButton value="nEuro" name="" label="nEuro" />
        <FormRadioButton value="ETH" name="" label="ETH" />
      </div>
      <div className="form-group">
        <FormLabel>
          <FormattedMessage id="eto.form.section.eto-terms.prospectus-language" />
        </FormLabel>
        <Toggle
          disabledLabel={
            <FormattedMessage id="eto.form.section.eto-terms.prospectus-language.disabled-label" />
          }
          enabledLabel={
            <FormattedMessage id="eto.form.section.eto-terms.prospectus-language.enabled-label" />
          }
          onClick={() => {}}
        />
      </div>
      <div className="form-group">
        <FormLabel>
          <FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration" />
        </FormLabel>
        <FormRange
          name="preSaleDuration"
          min={1}
          unitMin={<FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-min" />}
          max={14}
          unitMax={<FormattedMessage id="eto.form.section.eto-terms.pre-sale-duration.unit-max" />}
        />
      </div>
      <div className="form-group">
        <FormLabel>
          <FormattedMessage id="eto.form.section.eto-terms.public-offer-duration" />
        </FormLabel>
        <FormRange
          name="publicOfferDuration"
          min={0}
          unit={
            <FormattedMessage id="eto.form.section.eto-terms.public-offer-duration-duration.unit" />
          }
          max={8}
        />
      </div>
      <FormField
        label={<FormattedMessage id="eto.form.section.eto-terms.minimum-ticket-size" />}
        placeholder="1"
        prefix="€"
        name="minTicketEur"
      />
      <div className="form-group">
        <FormCheckbox
          name="enableTransferOnSuccess"
          label={
            <FormattedMessage id="eto.form.section.eto-terms.token-transfers-enabled-after-eto" />
          }
        />
      </div>
      <div className="form-group">
        <FormCheckbox
          name="riskRegulatedBusiness"
          label={<FormattedMessage id="eto.form.section.eto-terms.eto-is-under-regulation" />}
        />
      </div>
    </FormSection>

    <FormSection title={<FormattedMessage id="eto.form.section.token-holders-rights.title" />}>
      <FormSelectField
        values={TOKEN_HOLDERS_RIGHTS}
        label={
          <FormattedMessage id="eto.form.section.token-holders-rights.third-party-dependency" />
        }
        name="riskThirdParty"
      />
      <div className="form-group">
        <FormLabel>
          <FormattedMessage id="eto.form.section.token-holders-rights.liquidation-preference" />
        </FormLabel>
        <FormRange name="liquidationPreferenceMultiplier" min={0} unit="%" max={200} />
      </div>
      <div className="form-group">
        <FormCheckbox
          name="tagAlongVotingRule"
          label={
            <FormattedMessage id="eto.form.section.token-holders-rights.voting-rights-enabled" />
          }
        />
      </div>
    </FormSection>
    <Col>
      <Row className="justify-content-end">
        <Button
          layout="primary"
          className="mr-4"
          type="submit"
          onClick={() => {
            props.saveData(props.values);
          }}
          isLoading={props.savingData}
        >
          Save
        </Button>
      </Row>
    </Col>
  </EtoFormBase>
);

const EtoEnhancedForm = withFormik<IProps, TPartialCompanyEtoData>({
  validationSchema: EtoTermsType.toYup(),
  mapPropsToValues: props => props.stateValues,
  handleSubmit: (values, props) => props.props.saveData(values),
})(EtoForm);

export const EtoRegistrationTermsComponent: React.SFC<IProps> = props => (
  <EtoEnhancedForm {...props} />
);

export const EtoRegistrationTerms = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: s.etoFlow.companyData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: TPartialCompanyEtoData) => {
        dispatch(actions.etoFlow.saveDataStart({ companyData: data, etoData: {} }));
      },
    }),
  }),
  onEnterAction({
    actionCreator: _dispatch => {},
  }),
)(EtoRegistrationTermsComponent);
