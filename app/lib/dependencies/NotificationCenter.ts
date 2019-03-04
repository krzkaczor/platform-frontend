import { injectable } from "inversify";

import { showErrorToast, showInfoToast } from "../../components/shared/Toast";
import { getMessageTranslation } from "../../components/translatedMessages/messages";
import { TMessage } from "../../components/translatedMessages/utils";

@injectable()
export class NotificationCenter {
  public error(message: TMessage): void {
    showErrorToast(getMessageTranslation(message));
  }
  public info(message: TMessage): void {
    showInfoToast(getMessageTranslation(message));
  }
}
