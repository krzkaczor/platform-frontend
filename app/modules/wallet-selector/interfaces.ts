import {TMessage} from "../../components/translatedMessages/utils";
import {DeepReadonly} from "../../types";

export interface IWalletSelectorState {
  isMessageSigning: boolean;
  messageSigningError?: DeepReadonly<TMessage>;
}
