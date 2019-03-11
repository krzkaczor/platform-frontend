import { isMatch } from "lodash/fp";
import {
  call,
  Effect,
  getContext,
  race,
  spawn,
  StringableActionCreator,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";

import { TGlobalDependencies } from "../di/setupBindings";
import { TAction, TActionPayload, TActionType } from "./actions";

type TSagaWithDeps = (deps: TGlobalDependencies, ...args: any[]) => any;

export function* neuTakeLatest(
  type: TActionType | TActionType[] | StringableActionCreator<TAction>,
  saga: TSagaWithDeps,
): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  yield takeLatest(type, saga, deps);
}

export function* neuTakeEvery(
  type: TActionType | TActionType[] | StringableActionCreator<TAction>,
  saga: TSagaWithDeps,
): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  yield takeEvery(type, saga, deps);
}

export function* neuFork(saga: TSagaWithDeps, ...args: any[]): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  return yield spawn(saga, deps, args[0], args[1], args[2], args[3], args[4]);
}

export function* neuCall(saga: TSagaWithDeps, ...args: any[]): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  return yield call(saga, deps, args[0], args[1], args[2], args[3], args[4]);
}

/**
 * Starts saga on `startAction`, cancels on `stopAction`, loops...
 */
export function* neuTakeUntil(
  startAction: TActionType | TActionType[] | StringableActionCreator<TAction>,
  stopAction: TActionType | TActionType[] | StringableActionCreator<TAction>,
  saga: TSagaWithDeps,
): any {
  while (true) {
    const action = yield take(startAction);
    // No direct concurrent requests like `fork` or `spawn` should be in the loop
    yield race({
      task: neuCall(saga, action),
      cancel: take(stopAction),
    });
  }
}

/**
 *  Awaits an Action with specific payload.
 *  You can pass only a part of the payload that you want to match.
 */
export function* neuTakeOnly<T extends TActionType>(
  type: T,
  payload: Partial<TActionPayload<T>>,
): any {
  while (true) {
    const takenAction = yield take(type);
    if (isMatch(payload, takenAction.payload)) {
      return takenAction;
    }
  }
}

/**
 *  Executes the generator and repeats if repeatAction was dispatched. Exits when endAction
 *  is dispatched.
 */
export function* neuRepeatIf(
  repeatAction: TActionType | TActionType[],
  endAction: TActionType | TActionType[],
  generator: TSagaWithDeps,
  ...args: any[]
): any {
  while (true) {
    yield neuCall(generator, ...args);

    const { repeat, end } = yield race({
      repeat: take(repeatAction),
      end: take(endAction),
    });
    if (repeat) {
      continue;
    }
    if (end) {
      return;
    }
  }
}
