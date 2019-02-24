import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";
import BigNumber from "bignumber.js";

import {testEtoState} from "../../../../../test/fixtures/testEtoState";
import {testEtoBl} from "../../../../../test/fixtures/testEtoBl";
import {
  EETOStateOnChain, TBlEtoWithCompanyAndContract,
  TStateEtoWithCompanyAndContract,
} from "../../../../modules/public-etos/interfaces/interfaces";
import { withStore } from "../../../../utils/storeDecorator";
import { EtoWidgetContext } from "../../EtoWidgetView";
import { EtoOverviewStatusLayout } from "./EtoOverviewStatus";
import {NumericString} from "../../../../types";

const etoState: TStateEtoWithCompanyAndContract = {
  ...testEtoState,
  preMoneyValuationEur: "10000" as NumericString,
  existingCompanyShares: "10" as NumericString,
  equityTokensPerShare: "10" as NumericString,
  publicDiscountFraction: "0.2" as NumericString,
  whitelistDiscountFraction: "0.3" as NumericString,
  maxPledges: "100" as NumericString,
  maxTicketEur: "1000" as NumericString,
  minTicketEur: "1" as NumericString,
  equityTokenName: "TokenName",
  equityTokenSymbol: "TKN",
  company: { ...testEtoState.company, brandName: "BrandName" },
  contract: {
    ...testEtoState.contract!,
    timedState: EETOStateOnChain.Whitelist,
  },
};

const etoBl: TBlEtoWithCompanyAndContract = {
  ...testEtoBl,
  preMoneyValuationEur: new BigNumber("10000"),
  existingCompanyShares: new BigNumber("10"),
  equityTokensPerShare: new BigNumber("10"),
  publicDiscountFraction: new BigNumber("0.2"),
  whitelistDiscountFraction: new BigNumber("0.3"),
  maxPledges: new BigNumber("100"),
  maxTicketEur: new BigNumber("1000"),
  minTicketEur: new BigNumber("1"),
  equityTokenName: "TokenName",
  equityTokenSymbol: "TKN",
  company: { ...testEtoBl.company, brandName: "BrandName" },
  contract: {
    ...testEtoBl.contract!,
    timedState: EETOStateOnChain.Whitelist,
  },
};

storiesOf("ETO/EtoOverviewStatus", module)
  .addDecorator(
    withStore({
      publicEtos: {
        publicEtos: { [etoState.previewCode]: etoState },
        companies: { [etoState.companyId]: etoState.company },
        contracts: { [etoState.previewCode]: etoState.contract },
      },
    }),
  )
  .add("default", () => (
    <EtoWidgetContext.Provider value={etoBl.previewCode}>
      <EtoOverviewStatusLayout
        eto={etoBl}
        isAuthorized={true}
        isEligibleToPreEto={true}
        maxCapExceeded={false}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
      />
    </EtoWidgetContext.Provider>
  ))
  .add("not public", () => (
    <EtoWidgetContext.Provider value={undefined}>
      <EtoOverviewStatusLayout
        eto={etoBl}
        isAuthorized={true}
        isEligibleToPreEto={true}
        maxCapExceeded={false}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
        publicView={false}
      />
    </EtoWidgetContext.Provider>
  ))
  .add("with whitelist discount", () => (
    <EtoWidgetContext.Provider value={etoBl.previewCode}>
      <EtoOverviewStatusLayout
        eto={etoBl}
        isAuthorized={true}
        isEligibleToPreEto={true}
        isPreEto={true}
        maxCapExceeded={false}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
      />
    </EtoWidgetContext.Provider>
  ))
  .add("without discount", () => (
    <EtoWidgetContext.Provider value={etoBl.previewCode}>
      <EtoOverviewStatusLayout
        eto={{ ...etoBl, publicDiscountFraction: new BigNumber(0) }}
        isAuthorized={true}
        isEligibleToPreEto={true}
        maxCapExceeded={false}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
      />
    </EtoWidgetContext.Provider>
  ))
  .add("whitelisted not eligible", () => (
    <EtoWidgetContext.Provider value={etoBl.previewCode}>
      <EtoOverviewStatusLayout
        eto={{ ...etoBl }}
        isAuthorized={true}
        isEligibleToPreEto={false}
        maxCapExceeded={false}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
      />
    </EtoWidgetContext.Provider>
  ))
  .add("successful", () => (
    <EtoWidgetContext.Provider value={etoBl.previewCode}>
      <EtoOverviewStatusLayout
        eto={{
          ...etoBl,
          isBookbuilding: true,
          contract: { ...etoBl.contract, timedState: EETOStateOnChain.Claim } as any,
        }}
        isAuthorized={true}
        isEligibleToPreEto={false}
        maxCapExceeded={false}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
      />
    </EtoWidgetContext.Provider>
  ))
  .add("max cap exceeded whitelisted", () => (
    <EtoWidgetContext.Provider value={etoBl.previewCode}>
      <EtoOverviewStatusLayout
        eto={{
          ...etoBl,
          contract: {
            ...etoBl.contract,
            startOfStates: {
              ...etoBl.contract!.startOfStates,
              [EETOStateOnChain.Public]: moment()
                .add(7, "days")
                .toDate(),
            },
          } as any,
        }}
        isAuthorized={true}
        isEligibleToPreEto={true}
        maxCapExceeded={true}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
      />
    </EtoWidgetContext.Provider>
  ))
  .add("max cap exceeded public", () => (
    <EtoWidgetContext.Provider value={etoBl.previewCode}>
      <EtoOverviewStatusLayout
        eto={
          {
            ...etoBl,
            contract: {
              ...etoBl.contract,
              timedState: EETOStateOnChain.Public,
            },
          } as any
        }
        isAuthorized={true}
        isEligibleToPreEto={true}
        maxCapExceeded={true}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
      />
    </EtoWidgetContext.Provider>
  ));
