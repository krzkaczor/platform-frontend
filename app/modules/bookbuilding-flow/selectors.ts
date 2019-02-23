import {convert} from "../../components/eto/utils";
import { IAppState } from "../../store";
import * as bookbuildingStatsInterfaces from "./interfaces/BookbuildingStats";
import * as pledgeInterfaces from './interfaces/Pledge'

export const selectBookbuildingStats = (state: IAppState, etoId: string):bookbuildingStatsInterfaces.IBlBookBuildingStats =>
  convert(state.bookBuildingFlow.bookbuildingStats[etoId], bookbuildingStatsInterfaces.stateToBlConversionSpec);

export const selectMyPledge = (state: IAppState, etoId: string): pledgeInterfaces.IBlPledge | undefined =>
  convert(state.bookBuildingFlow.pledges[etoId], pledgeInterfaces.stateToBlConversionSpec);
