import { fork, put } from "redux-saga/effects";

import {convert} from "../../components/eto/utils";
import { TGlobalDependencies } from "../../di/setupBindings";
import { IHttpResponse } from "../../lib/api/client/IHttpClient";
import { actions } from "../actions";
import { neuTakeEvery } from "../sagasUtils";
import * as gasModelInterfaces from './interfaces'

function* ensureGasApiDataSaga({ gasApi, logger }: TGlobalDependencies): any {
  try {
    const gasValue: IHttpResponse<gasModelInterfaces.IApiGasModel> = yield gasApi.getGas();

    yield put(actions.gas.gasApiLoaded({ data: convert(gasValue.body, gasModelInterfaces.apiToStateConversionSpec) }));
  } catch (e) {
    logger.error("Error while loading GAS api data.", e);
    yield put(actions.gas.gasApiLoaded({ error: e }));
  }
}

export function* gasApiSagas(): any {
  yield fork(neuTakeEvery, "GAS_API_ENSURE_LOADING", ensureGasApiDataSaga);
}
