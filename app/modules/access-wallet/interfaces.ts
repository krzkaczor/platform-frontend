import {TMessage} from "../../components/translatedMessages/utils";
import {DeepReadonly} from "../../types";

export interface IStateSignMessageModal {
  isModalOpen: boolean;
  errorMessage?: DeepReadonly<TMessage>;
  modalTitle?: DeepReadonly<TMessage>;
  modalMessage?: DeepReadonly<TMessage>;
}
