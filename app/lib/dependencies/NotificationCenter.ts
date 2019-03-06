import { injectable } from "inversify";

import { showErrorToast, showInfoToast } from "../../components/shared/Toast";
import { getMessageTranslation } from "../../components/translatedMessages/messages";
import { TMessage } from "../../components/translatedMessages/utils";
import { TDataTestId } from "../../types";

@injectable()
export class NotificationCenter {
  public error(message: TMessage, options?: TDataTestId): void {
    showErrorToast(getMessageTranslation(message), options);
  }
  public info(message: TMessage, options?: TDataTestId): void {
    showInfoToast(getMessageTranslation(message), options);
  }
}
