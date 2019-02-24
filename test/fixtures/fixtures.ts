import { createStore, Store } from "redux";

import { IConfig } from "../../app/config/getConfig";
import {
  EEtoDocumentLanguage,
  EEtoDocumentType,
  TEtoDocumentTemplates,
  TEtoFormType,
} from "../../app/modules/eto-documents/interfaces";
import { EthereumAddress, EthereumAddressWithChecksum, EthereumNetworkId } from "../../app/types";

export const dummyConfig: IConfig = {
  ethereumNetwork: {
    rpcUrl: "https://localhost:8080",
  },
  contractsAddresses: {
    universeContractAddress: "UNIVERSE_ADDRESS",
  },
  bankTransferDetails: {
    recipient: "Fifth Force GmbH",
    iban: "DE1250094039446384529400565",
    bic: "TLXXXXXXXXX",
  },
};

export const dummyNetworkId: EthereumNetworkId = "5" as EthereumNetworkId;

export function createDummyStore(): Store<any> {
  return createStore(() => {});
}

export const dummyEthereumAddress = "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359" as EthereumAddress;
export const dummyEthereumAddressWithChecksum = "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359" as EthereumAddressWithChecksum;

export const etoDocuments: TEtoDocumentTemplates = {
  qmWKa6ZVZjZu3X2CtJnSnthUwWMeAcyfv9IZDnoawmULeT: {
    documentType: EEtoDocumentType.APPROVED_INVESTOR_OFFERING_DOCUMENT,
    form: "document" as TEtoFormType,
    ipfsHash: "QmWKa6zVZjZu3x2CtJnSNTHUwWMeAcyfv9iZDnoawmULeT",
    mimeType: "application/pdf",
    language: EEtoDocumentLanguage.EN,
    name: "./dev_fixtures/eto_fixtures/ETOInPublicState/investor_offering_document.pdf",
  },
  qmc4RZuxqKkvRahSuhs6QaeRq2VoqDiMXbiHwhZTfwXUdK: {
    documentType: EEtoDocumentType.SIGNED_TERMSHEET,
    form: "document" as TEtoFormType,
    ipfsHash: "Qmc4rZUXQKkvRahSUHS6qaeRq2voqDiMXbiHwhZTfwXUdK",
    mimeType: "application/pdf",
    language: EEtoDocumentLanguage.EN,
    name: "./dev_fixtures/eto_fixtures/ETOInPublicState/signed_termsheet.pdf",
  },
};
