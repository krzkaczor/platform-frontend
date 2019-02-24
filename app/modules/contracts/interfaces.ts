import BigNumber from "bignumber.js";

import { NumericString } from "../../types";
import { numericStringToBigNumber } from "../../utils/numericStringUtils";

/**
 * Constants from Platform Terms.
 * Mind the units. Durations are in seconds.
 */
export interface IStatePlatformTermsConstants {
  IS_ICBM_INVESTOR_WHITELISTED: boolean;
  MIN_TICKET_EUR_ULPS: NumericString;
  PLATFORM_NEUMARK_SHARE: NumericString;
  TOKEN_PARTICIPATION_FEE_FRACTION: NumericString;
  PLATFORM_FEE_FRACTION: NumericString;
  DATE_TO_WHITELIST_MIN_DURATION: NumericString;
  TOKEN_RATE_EXPIRES_AFTER: NumericString;

  MIN_WHITELIST_DURATION: NumericString;
  MAX_WHITELIST_DURATION: NumericString;

  MIN_OFFER_DURATION: NumericString;
  MAX_OFFER_DURATION: NumericString;

  MIN_PUBLIC_DURATION: NumericString;
  MAX_PUBLIC_DURATION: NumericString;

  MIN_SIGNING_DURATION: NumericString;
  MAX_SIGNING_DURATION: NumericString;

  MIN_CLAIM_DURATION: NumericString;
  MAX_CLAIM_DURATION: NumericString;
}

export interface IBlPlatformTermsConstants {
  IS_ICBM_INVESTOR_WHITELISTED: boolean;
  MIN_TICKET_EUR_ULPS: BigNumber;
  PLATFORM_NEUMARK_SHARE: BigNumber;
  TOKEN_PARTICIPATION_FEE_FRACTION: BigNumber;
  PLATFORM_FEE_FRACTION: BigNumber;
  DATE_TO_WHITELIST_MIN_DURATION: BigNumber;
  TOKEN_RATE_EXPIRES_AFTER: BigNumber;

  MIN_WHITELIST_DURATION: BigNumber;
  MAX_WHITELIST_DURATION: BigNumber;

  MIN_OFFER_DURATION: BigNumber;
  MAX_OFFER_DURATION: BigNumber;

  MIN_PUBLIC_DURATION: BigNumber;
  MAX_PUBLIC_DURATION: BigNumber;

  MIN_SIGNING_DURATION: BigNumber;
  MAX_SIGNING_DURATION: BigNumber;

  MIN_CLAIM_DURATION: BigNumber;
  MAX_CLAIM_DURATION: BigNumber;
}

export interface IApiPlatformTermsConstants {
  IS_ICBM_INVESTOR_WHITELISTED: boolean;
  MIN_TICKET_EUR_ULPS: BigNumber;
  PLATFORM_NEUMARK_SHARE: BigNumber;
  TOKEN_PARTICIPATION_FEE_FRACTION: BigNumber;
  PLATFORM_FEE_FRACTION: BigNumber;
  DATE_TO_WHITELIST_MIN_DURATION: BigNumber;
  TOKEN_RATE_EXPIRES_AFTER: BigNumber;

  MIN_WHITELIST_DURATION: BigNumber;
  MAX_WHITELIST_DURATION: BigNumber;

  MIN_OFFER_DURATION: BigNumber;
  MAX_OFFER_DURATION: BigNumber;

  MIN_PUBLIC_DURATION: BigNumber;
  MAX_PUBLIC_DURATION: BigNumber;

  MIN_SIGNING_DURATION: BigNumber;
  MAX_SIGNING_DURATION: BigNumber;

  MIN_CLAIM_DURATION: BigNumber;
  MAX_CLAIM_DURATION: BigNumber;
}

export const stateToBlConversionSpec = {
  MIN_TICKET_EUR_ULPS: numericStringToBigNumber(),
  PLATFORM_NEUMARK_SHARE: numericStringToBigNumber(),
  TOKEN_PARTICIPATION_FEE_FRACTION: numericStringToBigNumber(),
  PLATFORM_FEE_FRACTION: numericStringToBigNumber(),
  DATE_TO_WHITELIST_MIN_DURATION: numericStringToBigNumber(),
  TOKEN_RATE_EXPIRES_AFTER: numericStringToBigNumber(),

  MIN_WHITELIST_DURATION: numericStringToBigNumber(),
  MAX_WHITELIST_DURATION: numericStringToBigNumber(),

  MIN_OFFER_DURATION: numericStringToBigNumber(),
  MAX_OFFER_DURATION: numericStringToBigNumber(),

  MIN_PUBLIC_DURATION: numericStringToBigNumber(),
  MAX_PUBLIC_DURATION: numericStringToBigNumber(),

  MIN_SIGNING_DURATION: numericStringToBigNumber(),
  MAX_SIGNING_DURATION: numericStringToBigNumber(),

  MIN_CLAIM_DURATION: numericStringToBigNumber(),
  MAX_CLAIM_DURATION: numericStringToBigNumber(),
};

export const apiToStateConversionSpec = stateToBlConversionSpec;

export interface IStateContract {
  platformTermsConstants: IStatePlatformTermsConstants;
}

export type TContribution = [boolean, boolean, BigNumber, BigNumber, BigNumber, BigNumber, boolean];
