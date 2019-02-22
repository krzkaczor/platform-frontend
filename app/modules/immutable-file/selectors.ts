import { IAppState } from "../../store";

export const selectIsPendingDownload = (state: IAppState) => (ipfsHash: string): boolean => {
  return state.immutableStorage.pendingDownloads[ipfsHash] || false;
};

export const selectPendingDownloads = (state: IAppState): { [ipfsHash: string]: boolean } => {
  return state.immutableStorage.pendingDownloads;
};
