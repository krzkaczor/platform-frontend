import {TMessage} from "../../../components/translatedMessages/utils";
import {DeepReadonly} from "../../../types";

export interface ILightWalletWizardState {
  errorMsg?: DeepReadonly<TMessage>;
  isLoading: boolean;
}
