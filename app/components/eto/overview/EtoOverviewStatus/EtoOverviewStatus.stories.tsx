import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";

import { testEto } from "../../../../../test/fixtures";
import {
  EETOStateOnChain,
  TEtoWithCompanyAndContract,
} from "../../../../modules/public-etos/types";
import { withStore } from "../../../../utils/storeDecorator";
import { withMockedDate } from "../../../../utils/storybookHelpers";
import { EtoWidgetContext } from "../../EtoWidgetView";
import { EtoOverviewStatusLayout } from "./EtoOverviewStatus";

const eto: TEtoWithCompanyAndContract = {
  ...testEto,
  preMoneyValuationEur: 10000,
  existingCompanyShares: 10,
  equityTokensPerShare: 10,
  publicDiscountFraction: 0.2,
  whitelistDiscountFraction: 0.3,
  maxPledges: 100,
  maxTicketEur: 1000,
  minTicketEur: 1,
  equityTokenName: "TokenName",
  equityTokenSymbol: "TKN",
  company: { ...testEto.company, brandName: "BrandName" },
  contract: {
    ...testEto.contract!,
    timedState: EETOStateOnChain.Whitelist,
  },
};
// 2018-11-16T05:03:56.000Z
// Fri Nov 23 2018 06:03:56 GMT+0100
const dummyNow = new Date("2018-10-16T05:03:56+00:00");

storiesOf("ETO/EtoOverviewStatus", module)
  .addDecorator(
    withStore({
      publicEtos: {
        publicEtos: { [eto.previewCode]: eto },
        companies: { [eto.companyId]: eto.company },
        contracts: { [eto.previewCode]: eto.contract },
      },
    }),
  )
  .addDecorator(withMockedDate(dummyNow))
  .add("default", () => (
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout
        eto={eto}
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
        eto={eto}
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
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout
        eto={eto}
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
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout
        eto={{ ...eto, publicDiscountFraction: 0 }}
        isAuthorized={true}
        isEligibleToPreEto={true}
        maxCapExceeded={false}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
      />
    </EtoWidgetContext.Provider>
  ))
  .add("whitelisted not eligible", () => (
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout
        eto={{ ...eto }}
        isAuthorized={true}
        isEligibleToPreEto={false}
        maxCapExceeded={false}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
      />
    </EtoWidgetContext.Provider>
  ))
  .add("successful", () => (
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout
        eto={{
          ...eto,
          isBookbuilding: true,
          contract: { ...eto.contract, timedState: EETOStateOnChain.Claim } as any,
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
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout
        eto={{
          ...eto,
          contract: {
            ...eto.contract,
            startOfStates: {
              ...eto.contract!.startOfStates,
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
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout
        eto={
          {
            ...eto,
            contract: {
              ...eto.contract,
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
