import { EUserType } from "../../../modules/auth/interfaces";
import { TWalletMetadata } from "../../persistence/WalletMetadataObjectStorage";

export const getDummyUser = (walletMetadata: TWalletMetadata) => ({
  userId: "user-id",
  type: EUserType.INVESTOR,
  walletType: walletMetadata.walletType,
  walletSubtype: walletMetadata.walletSubType,
});
