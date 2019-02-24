import { DeepReadonly } from "../../types";
import { IBlGenericModalObject, IStateGenericModal } from "./interfaces";

export const selectGenericModalIsOpen = (state: DeepReadonly<IStateGenericModal>): boolean =>
  state.isOpen;
export const selectGenericModalObj = (
  state: DeepReadonly<IStateGenericModal>,
): DeepReadonly<IBlGenericModalObject> | undefined => state.genericModalObj;
export const selectGenericModalComponent = (
  state: DeepReadonly<IStateGenericModal>,
): React.ComponentType<any> | undefined => state.component;
