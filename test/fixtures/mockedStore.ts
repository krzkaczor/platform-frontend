import { testEtoApi } from "./testEtoApi";

export const mockedStore = {
  web3: {
    connected: true,
    wallet: {
      address: "0xa2133ccd9560a140c5399529d3e751bf3f13877f",
      email: "storybook@neufund.org",
      salt: "qwerty123=",
      vault: '{"salt":"qwerty123=","hdPathString":"m/44\'/60\'/0\'","encSeed":{"encStr":""]}',
      walletType: "LIGHT",
      walletSubType: "UNKNOWN",
    },
    isUnlocked: true,
  },
  auth: {
    jwt: "",
    user: {
      walletSubtype: "UNKNOWN",
      walletType: "LIGHT",
      type: "investor",
      unverifiedEmail: "storybook@neufund.org",
      language: "en",
      latestAcceptedTosIpfs: "qwerty123",
      backupCodesVerified: false,
      userId: "0xqwerty123",
    },
    currentAgreementHash: "qwerty123",
  },
  wallet: {
    loading: false,
    data: {
      euroTokenICBMLockedWallet: {
        LockedBalance: "0",
        neumarksDue: "0",
        unlockDate: "0",
      },
      etherTokenICBMLockedWallet: {
        LockedBalance: "0",
        neumarksDue: "0",
        unlockDate: "0",
      },
      euroTokenLockedWallet: {
        LockedBalance: "0",
        neumarksDue: "0",
        unlockDate: "0",
      },
      etherTokenLockedWallet: {
        LockedBalance: "0",
        neumarksDue: "0",
        unlockDate: "0",
      },
      etherTokenUpgradeTarget: "",
      euroTokenUpgradeTarget: "",
      etherTokenBalance: "0",
      euroTokenBalance: "0",
      etherBalance: "0",
      neuBalance: "0",
    },
  },
  publicEtos: {
    publicEtos: { [testEtoApi.previewCode]: testEtoApi },
    companies: { [testEtoApi.companyId]: testEtoApi.company },
    contracts: { [testEtoApi.previewCode]: testEtoApi.contract },
    displayOrder: [testEtoApi.previewCode],
  },
} as any;
