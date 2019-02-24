import { TMessage } from "../../../components/translatedMessages/utils";
import { DeepReadonly } from "../../../types";

export interface IBrowserWalletWizardState {
  errorMsg?: DeepReadonly<TMessage>;
  isLoading: boolean;
  approvalRejected: boolean;
}
