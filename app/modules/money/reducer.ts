import { AppReducer } from "../../store";
//TODO is this used anywhere?
export interface IMoneyState {
  euroTokenDecimals: number;
  etherTokenDecimals: number;
  neumarkTokenDecimals: number;
  eurDecimals: number;
}

export const moneyInitState: IMoneyState = {
  euroTokenDecimals: 18,
  etherTokenDecimals: 18,
  neumarkTokenDecimals: 18,
  eurDecimals: 18,
};

export const moneyReducer: AppReducer<IMoneyState> = (
  state = moneyInitState,
  _action,
): IMoneyState => {
  return state;
};
