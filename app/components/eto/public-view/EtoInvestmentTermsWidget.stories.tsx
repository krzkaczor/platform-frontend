import { storiesOf } from "@storybook/react";
import * as React from "react";
import BigNumber from "bignumber.js";

import { testEtoBl } from "../../../../test/fixtures/testEtoBl";
import { TBlEtoWithCompanyAndContract } from "../../../modules/public-etos/interfaces/interfaces";
import { EtoInvestmentTermsWidgetLayout } from "./EtoInvestmentTermsWidget";

const eto: TBlEtoWithCompanyAndContract = {
  ...testEtoBl,
  preMoneyValuationEur: new BigNumber(10000),
  existingCompanyShares: new BigNumber(10),
  equityTokensPerShare: new BigNumber(10),
  publicDiscountFraction: new BigNumber(0.2),
  whitelistDiscountFraction: new BigNumber(0.3),
};

storiesOf("ETO/EtoInvestmentTermsWidget", module).add("default", () => (
  <EtoInvestmentTermsWidgetLayout etoData={eto} downloadDocument={() => {}} />
));
