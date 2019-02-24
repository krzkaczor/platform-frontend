import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { NumberSchema } from "yup";

import {
  PlatformTerms,
  PUBLIC_DURATION_DAYS,
  Q18,
  SIGNING_DURATION_DAYS,
  WHITELIST_DURATION_DAYS,
} from "../../config/constants";
import * as YupTS from "../../lib/yup-ts";

export const EtoTermsValidator = YupTS.object({
  currencies: YupTS.array(YupTS.string()),
  prospectusLanguage: YupTS.string(),
  minTicketEur: YupTS.number().enhance((v: NumberSchema) => {
    const minTicketEur = PlatformTerms.MIN_TICKET_EUR_ULPS.div(Q18).toNumber();

    return v.min(minTicketEur, (
      <FormattedMessage
        id="eto.form.section.eto-terms.minimum-ticket-size.error.less-than-accepted"
        values={{ value: minTicketEur }}
      />
    ) as any);
  }),
  maxTicketEur: YupTS.number()
    .optional()
    .enhance(validator =>
      validator.when("minTicketEur", (value: number) =>
        validator.moreThan(value, (
          <FormattedMessage id="eto.form.section.eto-terms.maximum-ticket-size.error.less-than-minimum" />
        ) as any),
      ),
    ),
  enableTransferOnSuccess: YupTS.boolean(),
  notUnderCrowdfundingRegulations: YupTS.onlyTrue(
    <FormattedMessage id="eto.form.section.eto-terms.is-not-crowdfunding.error" />,
  ),
  allowRetailInvestors: YupTS.boolean(),
  whitelistDurationDays: YupTS.number().enhance(v =>
    v.min(WHITELIST_DURATION_DAYS.min).max(WHITELIST_DURATION_DAYS.max),
  ),
  publicDurationDays: YupTS.number().enhance(v =>
    v.min(PUBLIC_DURATION_DAYS.min).max(PUBLIC_DURATION_DAYS.max),
  ),
  signingDurationDays: YupTS.number().enhance(v =>
    v.min(SIGNING_DURATION_DAYS.min).max(SIGNING_DURATION_DAYS.max),
  ),
  additionalTerms: YupTS.string().optional(),
});
