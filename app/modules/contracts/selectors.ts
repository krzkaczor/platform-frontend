import {convert} from "../../components/eto/utils";
import { IAppState } from "../../store";
import * as platformTermsConstantsInterfaces from "./interfaces";

export const selectPlatformTermsConstants = (state: IAppState):platformTermsConstantsInterfaces.IBlPlatformTermsConstants =>
  convert(state.contracts.platformTermsConstants, platformTermsConstantsInterfaces.stateToBlConversionSpec);
