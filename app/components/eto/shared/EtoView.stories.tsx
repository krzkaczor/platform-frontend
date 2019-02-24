import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Container } from "reactstrap";

import { testCompanyBl } from "../../../../test/fixtures/testCompanyBl";
import { testEtoBl } from "../../../../test/fixtures/testEtoBl";
import { withStore } from "../../../utils/storeDecorator";
import { EtoView } from "./EtoView";

const testStore = {
  publicEtos: {
    publicEtos: {
      "deabb8a4-d081-4d15-87a7-737a09e6a87c": testEtoBl,
    },
    contracts: {
      "deabb8a4-d081-4d15-87a7-737a09e6a87c": testEtoBl,
    },
    companies: {
      "0xC8f867Cf4Ed30b4fF0Aa4c4c8c6b684397B219B0": testCompanyBl,
    },
  },
};

storiesOf("ETO/EtoView", module)
  .addDecorator(withStore(testStore as any))
  .add("default", () => (
    <Container>
      <EtoView eto={testEtoBl} />
    </Container>
  ));
