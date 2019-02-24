import { withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { etoFormIsReadonly } from "../../../../lib/api/eto/EtoApiUtils";
import { actions } from "../../../../modules/actions";
import { EEtoFormTypes } from "../../../../modules/eto-flow/interfaces/interfaces";
import {IBlPublicEtoData} from "../../../../modules/eto-flow/interfaces/PublicEtoData";
import { selectIssuerEto, selectIssuerEtoState } from "../../../../modules/eto-flow/selectors";
import {EtoVotingRightsValidator} from "../../../../modules/eto-flow/validators";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { BOOL_TRUE_KEY, FormSelectField } from "../../../shared/forms";
import { FormFieldLabel } from "../../../shared/forms/fields/FormFieldLabel";
import { FormToggle } from "../../../shared/forms/fields/FormToggle";
import { applyDefaults, convert, parseStringToFloat } from "../../utils";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

import * as styles from "../Shared.module.scss";

// TODO: this keys will be replaced dynamically by addresses from an API endpoint, once there are more than one
const TOKEN_HOLDERS_RIGHTS = {
  [BOOL_TRUE_KEY]: "Neumini UG",
};

const LIQUIDATION_PREFERENCE_VALUES = [0, 1, 1.5, 2];

const defaults = {
  liquidationPreferenceMultiplier: 0,
  generalVotingRule: "positive",
};

interface IExternalProps {
  readonly: boolean;
}

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: Partial<IBlPublicEtoData>;
}

interface IDispatchProps {
  saveData: (values: Partial<IBlPublicEtoData>) => void;
}

type IProps = IExternalProps & IStateProps & IDispatchProps;

const EtoVotingRightsComponent: React.FunctionComponent<IProps> = ({ readonly, savingData }) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.eto-voting-rights.title" />}
    validator={EtoVotingRightsValidator.toYup()}
  >
    <Section>
      <FormSelectField
        values={TOKEN_HOLDERS_RIGHTS}
        label={<FormattedMessage id="eto.form.section.token-holders-rights.nominee" />}
        name="nominee"
        disabled={readonly}
      />

      <FormSelectField
        customOptions={LIQUIDATION_PREFERENCE_VALUES.map(n => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
        label={
          <FormattedMessage id="eto.form.section.token-holders-rights.liquidation-preference" />
        }
        name="liquidationPreferenceMultiplier"
        disabled={readonly}
      />

      <div className="form-group">
        <FormFieldLabel name="generalVotingRule">
          <FormattedMessage id="eto.form.section.token-holders-rights.voting-rights-enabled" />
        </FormFieldLabel>
        <FormToggle
          name="generalVotingRule"
          trueValue="positive"
          falseValue="no_voting_rights"
          disabledLabel={<FormattedMessage id="form.select.no" />}
          enabledLabel={<FormattedMessage id="form.select.yes" />}
          disabled={readonly}
        />
      </div>
    </Section>

    {!readonly && (
      <Section className={styles.buttonSection}>
        <Button
          layout={EButtonLayout.PRIMARY}
          type="submit"
          isLoading={savingData}
          data-test-id="eto-registration-voting-rights-submit"
        >
          <FormattedMessage id="form.button.save" />
        </Button>
      </Section>
    )}
  </EtoFormBase>
);

const EtoVotingRights = compose<React.FunctionComponent<IExternalProps>>(
  setDisplayName(EEtoFormTypes.EtoVotingRights),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: selectIssuerEto(s) as Partial<IBlPublicEtoData>,
      readonly: etoFormIsReadonly(EEtoFormTypes.EtoVotingRights, selectIssuerEtoState(s)),
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: Partial<IBlPublicEtoData>) => {
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
  withFormik<IProps, Partial<IBlPublicEtoData>>({
    validationSchema: EtoVotingRightsValidator.toYup(),
    mapPropsToValues: props => applyDefaults(props.stateValues, defaults),
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoVotingRightsComponent);

const fromFormState = {
  liquidationPreferenceMultiplier: parseStringToFloat(),
};

export { EtoVotingRightsComponent, EtoVotingRights };
