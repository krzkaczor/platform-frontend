import { saveAs } from "file-saver";

import { getMessageTranslation } from "../../components/translatedMessages/messages";
import { TMessage } from "../../components/translatedMessages/utils";
import { IS_CYPRESS } from "../../config/constants";

export function downloadLink(blob: Blob, name: TMessage | string, fileExtension: string): void {
  if (IS_CYPRESS) {
    return;
  }

  const resolvedName = typeof name === "string" ? name : getMessageTranslation(name);
  saveAs(blob, `${resolvedName}${fileExtension}`);
}
