import * as cn from "classnames";
import { Formik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { generateCampaigningValidator } from "../../../../../modules/bookbuilding-flow/validators";
import { Button, ButtonSize, ButtonWidth } from "../../../../shared/buttons";
import { CheckboxLayout, Form, FormInput, InputSize } from "../../../../shared/forms";
import { ECurrency, ECurrencySymbol, EMoneyFormat, Money } from "../../../../shared/Money";
import { Tooltip } from "../../../../shared/Tooltip";

import * as styles from "../EtoOverviewStatus.module.scss";
import BigNumber from "bignumber.js";

export enum CampaigningFormState {
  VIEW,
  EDIT,
}

export interface ICampaigningActivatedInvestorWidgetLayoutProps {
  pledgedAmount: BigNumber | null;
  consentToRevealEmail: boolean;
  backNow: (amount: BigNumber) => void;
  formState: CampaigningFormState;
  showMyEmail: (consentToRevealEmail: boolean) => void;
  changePledge: () => void;
  deletePledge: () => void;
  minPledge: number;
  maxPledge?: number;
}

const CampaigningActivatedInvestorApprovedWidgetLayout: React.FunctionComponent<
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
          <FormattedMessage id="shared-component.eto-overview.reveal-my-email" />
          <Tooltip
            content={
              <FormattedMessage id="shared-component.eto-overview.reveal-my-email.tooltip" />
            }
          />
        </label>
        <div className={styles.value}>
          <CheckboxLayout
            name="consentToRevealEmail"
            inputId="consentToRevealEmail"
            checked={consentToRevealEmail}
            onChange={event => showMyEmail(event.target.checked)}
          />
        </div>
      </div>
      {formState === CampaigningFormState.VIEW ? (
        <div className={styles.group}>
          <div className={styles.label} data-test-id="campaigning-your-commitment">
            <FormattedMessage id="eto-overview.campaigning.your-commitment" />
            <br />
            <Money
              value={pledgedAmount}
              currency={ECurrency.EUR}
              format={EMoneyFormat.FLOAT}
              currencySymbol={ECurrencySymbol.SYMBOL}
            />
          </div>
          <div className={styles.value}>
            <button onClick={changePledge} className={styles.changePledge}>
              <FormattedMessage id="shared-component.eto-overview.change" />
            </button>{" "}
            <FormattedMessage id="shared-component.eto-overview.or" />{" "}
            <button onClick={deletePledge} className={styles.deletePledge}>
              <FormattedMessage id="shared-component.eto-overview.delete" />
            </button>{" "}
            <FormattedMessage id="shared-component.eto-overview.your-pledge" />{" "}
          </div>
        </div>
      ) : (
        <Formik<{ amount: string }>
          initialValues={{ amount: pledgedAmount ? pledgedAmount.toString() : ""}}
          onSubmit={({ amount }) => backNow(new BigNumber(amount))}
          validationSchema={generateCampaigningValidator(minPledge, maxPledge)}
        >
          <Form className={styles.group}>
            <div className={cn(styles.label)}>
              <FormattedMessage id="eto-overview.campaigning.indicate-commitment" />
              <FormInput
                size={InputSize.SMALL}
                name="amount"
                prefix="€"
                maxLength={8}
                type="text"
              />
            </div>
            <div className={cn(styles.value, styles.backNow)}>
              <Button
                data-test-id="eto-bookbuilding-back-now"
                type="submit"
                size={ButtonSize.SMALL}
                width={ButtonWidth.BLOCK}
              >
                <FormattedMessage id="shared-component.eto-overview.back-now" />
              </Button>
            </div>
          </Form>
        </Formik>
      )}
    </>
  );
};

export { CampaigningActivatedInvestorApprovedWidgetLayout };
