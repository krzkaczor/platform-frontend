import { dummyEthereumAddress } from "../../../test/fixtures/fixtures";
import {
  IBrowserWalletMetadata,
  ILedgerWalletMetadata,
  ILightWalletMetadata,
} from "../../lib/persistence/WalletMetadataObjectStorage";
import { EWalletSubType, EWalletType } from "./interfaces";

export const getDummyLightWalletMetadata = (): ILightWalletMetadata => ({
  walletType: EWalletType.LIGHT,
  walletSubType: EWalletSubType.UNKNOWN,
  address: dummyEthereumAddress,
  vault: "vault",
  email: "test@example.com",
  salt: "salt",
});

export const getDummyBrowserWalletMetadata = (): IBrowserWalletMetadata => ({
  walletType: EWalletType.BROWSER,
  address: dummyEthereumAddress,
  walletSubType: EWalletSubType.METAMASK,
});

export const getDummyLedgerWalletMetadata = (): ILedgerWalletMetadata => ({
  walletType: EWalletType.LEDGER,
  walletSubType: EWalletSubType.UNKNOWN,
  derivationPath: "derivationPath",
  address: dummyEthereumAddress,
});
