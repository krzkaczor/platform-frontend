import BigNumber from "bignumber.js";

import { testEto } from "../fixtures";

export const mockedStore = {
  etoFlow: {
    etoPreviewCode: testEto.previewCode,
  },
  contracts: {
    platformTermsConstants: {
      IS_ICBM_INVESTOR_WHITELISTED: true,
      MIN_TICKET_EUR_ULPS: new BigNumber("100000000000000000000"),
      PLATFORM_NEUMARK_SHARE: new BigNumber("2"),
      TOKEN_PARTICIPATION_FEE_FRACTION: new BigNumber("20000000000000000"),
      PLATFORM_FEE_FRACTION: new BigNumber("30000000000000000"),
      DATE_TO_WHITELIST_MIN_DURATION: new BigNumber("604800"),
      TOKEN_RATE_EXPIRES_AFTER: new BigNumber("14400"),
      MIN_WHITELIST_DURATION: new BigNumber("0"),
      MAX_WHITELIST_DURATION: new BigNumber("2592000"),
      MIN_OFFER_DURATION: new BigNumber("86400"),
      MAX_OFFER_DURATION: new BigNumber("7776000"),
      MIN_PUBLIC_DURATION: new BigNumber("0"),
      MAX_PUBLIC_DURATION: new BigNumber("5184000"),
      MIN_SIGNING_DURATION: new BigNumber("1209600"),
      MAX_SIGNING_DURATION: new BigNumber("5184000"),
      MIN_CLAIM_DURATION: new BigNumber("604800"),
      MAX_CLAIM_DURATION: new BigNumber("2592000"),
    },
  },
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
    publicEtos: { [testEto.previewCode]: testEto },
    companies: { [testEto.companyId]: testEto.company },
    contracts: { [testEto.previewCode]: testEto.contract },
    displayOrder: [testEto.previewCode],
  },
  bookBuildingFlow: {
    bookbuildingStats: {
      [testEto.etoId]: {
        investorsCount: 10,
        pledgedAmount: 500,
      },
    },
  },
} as any;
