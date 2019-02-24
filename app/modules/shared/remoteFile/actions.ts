import { createAction } from "../../actionsUtils";
import { IFileDescriptionState } from "./interfaces";

export const remoteFileActions = {
  getRemoteFile: (
    fileUrl: string,
    onDone: (error: any, fileDescription?: IFileDescriptionState) => any,
  ) => createAction("REMOTE_FILE_GET", { fileUrl, onDone }),
};
