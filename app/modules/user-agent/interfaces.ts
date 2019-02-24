import { TBrowserName } from "../../lib/dependencies/detectBrowser";

export interface IUserAgentState {
  name: TBrowserName;
  version: string;
}
