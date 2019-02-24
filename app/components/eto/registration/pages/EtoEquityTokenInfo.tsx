import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { etoFormIsReadonly } from "../../../../lib/api/eto/EtoApiUtils";
import { actions } from "../../../../modules/actions";
import { EEtoFormTypes } from "../../../../modules/eto-flow/interfaces/interfaces";
import * as publicEtoDataInterfaces from "../../../../modules/eto-flow/interfaces/PublicEtoData";
import { selectIssuerEto, selectIssuerEtoState } from "../../../../modules/eto-flow/selectors";
import {EtoEquityTokenInfoValidator} from "../../../../modules/eto-flow/validators"
import { appConnect } from "../../../../store";
import {DeepPartial} from "../../../../types";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { FormField } from "../../../shared/forms";
import { FormFieldLabel } from "../../../shared/forms/fields/FormFieldLabel";
import { FormSingleFileUpload } from "../../../shared/forms/fields/FormSingleFileUpload";
import {convert} from "../../utils";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";
import * as styles from "../Shared.module.scss";

interface IExternalProps {
  readonly: boolean;
}

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: DeepPartial<publicEtoDataInterfaces.IBlPublicEtoData>;
}

interface IDispatchProps {
  saveData: (values: DeepPartial<publicEtoDataInterfaces.IBlPublicEtoData>) => void;
}

type IProps = IExternalProps & IStateProps & IDispatchProps & FormikProps<DeepPartial<publicEtoDataInterfaces.IBlPublicEtoData>>;

const EtoEquityTokenInfoComponent: React.FunctionComponent<IProps> = ({ readonly, savingData }) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.eto-equity-token-info.title" />}
    validator={EtoEquityTokenInfoValidator.toYup()}
  >
    <Section>
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.token-name" />}
        placeholder="Token name"
        name="equityTokenName"
        disabled={readonly}
      />
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />}
        placeholder="3 - 4 characters"
        maxLength="4"
        name="equityTokenSymbol"
        disabled={readonly}
      />
      <div className="form-group">
        <FormFieldLabel name="equityTokenImage">
          <FormattedMessage id="eto.form.section.equity-token-information.token-image" />
        </FormFieldLabel>
        <FormSingleFileUpload
          label={<FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />}
          name="equityTokenImage"
          acceptedFiles="image/png"
          fileFormatInformation="*200 x 200px png"
          data-test-id="eto-registration-token-logo"
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
          data-test-id="eto-registration-token-info-submit"
        >
          <FormattedMessage id="form.button.save" />
        </Button>
      </Section>
    )}
  </EtoFormBase>
);

const EtoEquityTokenInfo = compose<React.FunctionComponent<IExternalProps>>(
  setDisplayName(EEtoFormTypes.EtoEquityTokenInfo),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: selectIssuerEto(s) as DeepPartial<publicEtoDataInterfaces.IBlPublicEtoData>,
      readonly: etoFormIsReadonly(EEtoFormTypes.EtoEquityTokenInfo, selectIssuerEtoState(s)),
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: DeepPartial<publicEtoDataInterfaces.IBlPublicEtoData>) => {
        dispatch(
          actions.etoFlow.saveDataStart({
            companyData: {},
            etoData: {
              ...convert(data, publicEtoDataInterfaces.blToStateConversionSpec),
            },
          }),
        );
      },
    }),
  }),
  withFormik<IStateProps & IDispatchProps, DeepPartial<publicEtoDataInterfaces.IBlPublicEtoData>>({
    validationSchema: EtoEquityTokenInfoValidator.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoEquityTokenInfoComponent);

export { EtoEquityTokenInfoComponent, EtoEquityTokenInfo };
