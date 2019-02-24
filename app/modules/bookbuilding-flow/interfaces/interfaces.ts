import { Dictionary } from "../../../types";
import { IStateBookBuildingStats } from "./BookbuildingStats";
import { IStatePledge } from "./Pledge";

export interface IStateBookbuildingFLow {
  //FIXME change all from number to BN
  bookbuildingStats: Dictionary<IStateBookBuildingStats>;
  pledges: Dictionary<IStatePledge | undefined>;
}
