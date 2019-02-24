import { genericModalIcons } from "../../components/modals/GenericModal";
import { TMessage } from "../../components/translatedMessages/utils";
import { AppActionTypes } from "../../store";

export interface IStateGenericModal {
  isOpen: boolean;
  genericModalObj?: IStateGenericModalObject;
  component?: React.ComponentType<any>; //FIXME no components in state
}

export interface IBlGenericModal {
  isOpen: boolean;
  genericModalObj?: IBlGenericModalObject;
  component?: React.ComponentType<any>; //FIXME no components in state
}

//Add more custom icons here
export type TIconType = keyof typeof genericModalIcons;

export interface IStateGenericModalObject {
  title: TMessage;
  description?: TMessage;
  icon?: TIconType;
  actionLinkText?: TMessage;
  onClickAction?: AppActionTypes;
}

export interface IBlGenericModalObject {
  title: TMessage;
  description?: TMessage;
  icon?: TIconType;
  actionLinkText?: TMessage;
  onClickAction?: AppActionTypes;
}
