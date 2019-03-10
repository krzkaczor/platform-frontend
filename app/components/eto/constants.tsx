import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../types";

interface IRounds {
  [key: string]: TTranslatedString;
}

export const FUNDING_ROUNDS: IRounds = {
  NONE_KEY: <FormattedMessage id="form.select.please-select" />,
  pre_seed: "Pre-Seed",
  seed: "Seed",
  a_round: "Series A",
  b_round: "Series B",
  c_round: "Series C",
  d_round: "Series D",
  e_round: "Series E",
  pre_ipo: "Pre-IPO",
  public: "PUBLIC",
};
