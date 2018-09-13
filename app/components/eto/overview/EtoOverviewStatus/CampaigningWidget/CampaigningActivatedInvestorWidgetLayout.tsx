import { Form, Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { generateCampaigningValidation } from "../../../../../lib/api/eto/EtoPledgeApi.interfaces";
import { Button } from "../../../../shared/Buttons";
import { CheckboxComponent, FormField } from "../../../../shared/forms";

import * as styles from "../EtoOverviewStatus.module.scss";

export enum CampaigningFormState {
  VIEW,
  EDIT,
}

export interface ICampaigningActivatedInvestorWidgetLayoutProps {
  pledgedAmount: number | "";
  consentToRevealEmail: boolean;
  backNow: (amount: number) => void;
  formState: CampaigningFormState;
  showMyEmail: (consentToRevealEmail: boolean) => void;
  changePledge: () => void;
  deletePledge: () => void;
  minPledge: number;
  maxPledge?: number;
}

const CampaigningActivatedInvestorWidgetLayout: React.SFC<
  ICampaigningActivatedInvestorWidgetLayoutProps
> = ({
  pledgedAmount,
  consentToRevealEmail,
  backNow,
  formState,
  showMyEmail,
  changePledge,
  deletePledge,
  minPledge,
  maxPledge,
}) => {
  return (
    <>
      <div className={styles.group}>
        <label htmlFor="consentToRevealEmail" className={styles.label}>
          <FormattedMessage id="shared-component.eto-overview.show-my-email" />
        </label>
        <div className={styles.value}>
          <CheckboxComponent
            name="consentToRevealEmail"
            inputId="consentToRevealEmail"
            checked={consentToRevealEmail}
            onChange={event => showMyEmail(event.target.checked)}
          />
        </div>
      </div>
      {formState === CampaigningFormState.VIEW ? (
        <div className={styles.group}>
          <div className={styles.label}>
            {"€ "}
            {pledgedAmount}
          </div>
          <div className={styles.value}>
            <span onClick={changePledge} className={styles.changePledge}>
              <FormattedMessage id="shared-component.eto-overview.change" />
            </span>{" "}
            <FormattedMessage id="shared-component.eto-overview.or" />{" "}
            <span onClick={deletePledge} className={styles.deletePledge}>
              <FormattedMessage id="shared-component.eto-overview.delete" />
            </span>{" "}
            <FormattedMessage id="shared-component.eto-overview.your-pledge" />{" "}
          </div>
        </div>
      ) : (
        <Formik
          initialValues={{ amount: pledgedAmount }}
          onSubmit={({ amount }) => backNow(amount as number)}
          validationSchema={generateCampaigningValidation(minPledge, maxPledge)}
        >
          <Form>
            <Row>
              <Col xs={12} xl={6}>
                <FormField type="number" name="amount" prefix="€" />
              </Col>
              <Col xs={12} xl={6}>
                <Button type="submit">
                  <FormattedMessage id="shared-component.eto-overview.back-now" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Formik>
      )}
    </>
  );
};

export { CampaigningActivatedInvestorWidgetLayout };