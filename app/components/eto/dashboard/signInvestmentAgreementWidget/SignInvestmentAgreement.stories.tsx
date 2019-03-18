import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EEtoDocumentType, TEtoFormType } from "../../../../lib/api/eto/EtoFileApi.interfaces";
import { SignInvestmentAgreementLayout } from "./SignInvestmentAgreement";
import { action } from "@storybook/addon-actions";

const ipfsHash = "1243654we645";

const doc = {
  documentType: EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT,
  form: "document" as TEtoFormType,
  ipfsHash,
  mimeType: "text/pdf",
  name: "signed Agreement",
};

const commonData = {
  etoId: "23423423423423",
  ipfsHash,
  uploadedAgreement: doc,
  signInvestmentAgreement: action("sign me"),
  signedInvestmentAgreementUrlLoading: false,
};

const noDocSignedData = {
  ...commonData,
  signedInvestmentAgreementUrl: null,
};

const needToSignAgainData = {
  ...commonData,
  signedInvestmentAgreementUrl: "ipfs:newHash",
};

const waitingForNomineeData = {
  ...commonData,
  signedInvestmentAgreementUrl: `ipfs:${ipfsHash}`,
};

storiesOf("ETO/SignInvestmentAgreement", module)
  .add("no doc signed", () => (
    <SignInvestmentAgreementLayout {...noDocSignedData} />
  ))
  .add("waiting for user to sign again", () => (
  <SignInvestmentAgreementLayout {...needToSignAgainData} />
))
  .add("waiting for nominee to sign", () => (
  <SignInvestmentAgreementLayout {...waitingForNomineeData} />
));
