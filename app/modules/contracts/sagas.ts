import { all, put } from "redux-saga/effects";

import { convert } from "../../components/eto/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { actions } from "../actions";
import * as platformTermsConstantsInterfaces from "./interfaces";

export async function initializeContracts({
  contractsService,
}: TGlobalDependencies): Promise<void> {
  await contractsService.init();
}

export function* populatePlatformTermsConstants({ contractsService }: TGlobalDependencies): any {
  const contract = contractsService.platformTerms;

  // These are constants from Universe contract no need for pooling
  const terms: platformTermsConstantsInterfaces.IApiPlatformTermsConstants = yield all({
    IS_ICBM_INVESTOR_WHITELISTED: contract.IS_ICBM_INVESTOR_WHITELISTED,
    MIN_TICKET_EUR_ULPS: contract.MIN_TICKET_EUR_ULPS,
    PLATFORM_NEUMARK_SHARE: contract.PLATFORM_NEUMARK_SHARE,
    TOKEN_PARTICIPATION_FEE_FRACTION: contract.TOKEN_PARTICIPATION_FEE_FRACTION,
    PLATFORM_FEE_FRACTION: contract.PLATFORM_FEE_FRACTION,
    DATE_TO_WHITELIST_MIN_DURATION: contract.DATE_TO_WHITELIST_MIN_DURATION,
    TOKEN_RATE_EXPIRES_AFTER: contract.TOKEN_RATE_EXPIRES_AFTER,
    MIN_WHITELIST_DURATION: contract.MIN_WHITELIST_DURATION,
    MAX_WHITELIST_DURATION: contract.MAX_WHITELIST_DURATION,
    MIN_OFFER_DURATION: contract.MIN_OFFER_DURATION,
    MAX_OFFER_DURATION: contract.MAX_OFFER_DURATION,
    MIN_PUBLIC_DURATION: contract.MIN_PUBLIC_DURATION,
    MAX_PUBLIC_DURATION: contract.MAX_SIGNING_DURATION,
    MIN_SIGNING_DURATION: contract.MIN_SIGNING_DURATION,
    MAX_SIGNING_DURATION: contract.MAX_SIGNING_DURATION,
    MIN_CLAIM_DURATION: contract.MIN_CLAIM_DURATION,
    MAX_CLAIM_DURATION: contract.MAX_CLAIM_DURATION,
  });

  yield put(
    actions.contracts.setPlatformTermConstants(
      convert(terms, platformTermsConstantsInterfaces.apiToStateConversionSpec),
    ),
  );
}
