import { EUserType } from "../../../modules/auth/interfaces";
import { EWalletType } from "../../../modules/web3/interfaces";

export type TUser = { id: string; type: EUserType; walletType: EWalletType };
export type LogArg = string | object;
export type ErrorArgs = LogArg | Error;

export interface ILogger {
  info(...args: LogArg[]): void;
  verbose(...args: LogArg[]): void;
  debug(...args: LogArg[]): void;
  warn(...args: ErrorArgs[]): void;
  error(...args: ErrorArgs[]): void;
  fatal(message: string, error: Error, data?: object): void;
  setUser(user: TUser | null): void;
}
