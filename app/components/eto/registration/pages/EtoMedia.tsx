import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { actions } from "../../../../modules/actions";
import { EEtoFormTypes } from "../../../../modules/eto-flow/interfaces/interfaces";
import {IBlPublicEtoData} from "../../../../modules/eto-flow/interfaces/PublicEtoData";
import { selectIssuerCompany } from "../../../../modules/eto-flow/selectors";
import { etoMediaProgressOptions } from "../../../../modules/eto-flow/utils";
import {EtoMediaValidator} from "../../../../modules/eto-flow/validators";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { FormField, FormFieldBoolean } from "../../../shared/forms";
import { MediaLinksEditor } from "../../../shared/MediaLinksEditor";
import { SOCIAL_PROFILES_ICONS, SocialProfilesEditor } from "../../../shared/SocialProfilesEditor";
import { Tooltip } from "../../../shared/Tooltip";
import { convert, removeEmptyKeyValueField, removeEmptyKeyValueFields } from "../../utils";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

import * as styles from "../Shared.module.scss";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: Partial<IBlPublicEtoData>;
}

interface IDispatchProps {
  saveData: (values: Partial<IBlPublicEtoData>) => void;
}

type IProps = IStateProps & IDispatchProps & FormikProps<Partial<IBlPublicEtoData>>;

const EtoRegistrationMediaComponent = ({ savingData }: IProps) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.eto-media.title" />}
    validator={EtoMediaValidator.toYup()}
    progressOptions={etoMediaProgressOptions}
  >
    <Section>
      <div className="mb-1 mt-3 font-weight-bold text-uppercase">
        <FormattedMessage id="eto.form.eto-media.youtube-video" />
      </div>
      <FormField placeholder="url" name="companyVideo.url" />

      <div className="mb-1 mt-3 font-weight-bold text-uppercase">
        <FormattedMessage id="eto.form.eto-media.slideshare" />
        <Tooltip content={<FormattedMessage id="eto.form.eto-media.slide-share.tooltip" />} />
      </div>
      <FormField placeholder="url" name="companySlideshare.url" />

      <div className="mb-2 mt-3 font-weight-bold">
        <FormattedMessage id="eto.form.eto-media.social-channels" />
      </div>
      <FormFieldBoolean
        name="disableTwitterFeed"
        label={<FormattedMessage id="eto.form.eto-media.enable-twitter-feed" />}
      />
      <SocialProfilesEditor
        profiles={SOCIAL_PROFILES_ICONS}
        name="socialChannels"
        className="mt-4"
      />

      <div className="mb-1 mt-3 font-weight-bold text-uppercase">
        <FormattedMessage id="eto.form.eto-media.media-links" />
      </div>
      <p className="mb-3">
        <FormattedMessage id="eto.form.eto-media.media-links-description" />
      </p>
      <MediaLinksEditor
        name="companyNews"
        placeholder="Media Link"
        blankField={{ publication: undefined, url: undefined, title: undefined }}
      />
      <div className=" mb-1 mt-3 font-weight-bold text-uppercase">
        <FormattedMessage id="eto.form.eto-media.campaigning-links" />
      </div>
      <p className=" mb-3">
        <FormattedMessage id="eto.form.eto-media.campaigning-links-description" />
      </p>
      <MediaLinksEditor
        name="marketingLinks"
        placeholder="Document Link"
        blankField={{ url: undefined, title: undefined }}
      />
    </Section>
    <Section className={styles.buttonSection}>
      <Button
        layout={EButtonLayout.PRIMARY}
        type="submit"
        isLoading={savingData}
        data-test-id="eto-registration-media-submit"
      >
        <FormattedMessage id="form.button.save" />
      </Button>
    </Section>
  </EtoFormBase>
);

const EtoRegistrationMedia = compose<React.FunctionComponent>(
  setDisplayName(EEtoFormTypes.EtoMedia),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: s.etoFlow.loading,
      savingData: s.etoFlow.saving,
      stateValues: selectIssuerCompany(s) as Partial<IBlPublicEtoData>,
    }),
    dispatchToProps: dispatch => ({
      saveData: (data: Partial<IBlPublicEtoData>) => {
        const convertedData = convert(data, fromFormState);
        dispatch(actions.etoFlow.saveDataStart({ companyData: convertedData, etoData: {} }));
      },
    }),
  }),
  withFormik<IProps, Partial<IBlPublicEtoData>>({
    validationSchema: EtoMediaValidator.toYup(),
    mapPropsToValues: props => props.stateValues,
    handleSubmit: (values, props) => props.props.saveData(values),
  }),
)(EtoRegistrationMediaComponent);

//adhoc validation, no need to move it to utils
const addTitleIfUrlNotEmpty = (data: any) => {
  if (data.url !== undefined) {
    return { ...data, title: "" };
  } else {
    return removeEmptyKeyValueField()(data);
  }
};

const fromFormState = {
  companyVideo: addTitleIfUrlNotEmpty,
  companySlideshare: addTitleIfUrlNotEmpty,
  socialChannels: removeEmptyKeyValueFields(),
  companyNews: removeEmptyKeyValueFields(),
  marketingLinks: removeEmptyKeyValueFields(),
};

export { EtoRegistrationMediaComponent, EtoRegistrationMedia };
