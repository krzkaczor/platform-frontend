import * as React from "react";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { EKycRequestType, IKycFileInfo } from "../../../modules/kyc/interfaces";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";

import { MultiFileUpload } from "../../shared/MultiFileUpload";

interface IStateProps {
  fileUploading: boolean;
  files: ReadonlyArray<IKycFileInfo>;
}

interface IDispatchProps {
  onDropFile: (file: File) => void;
}

interface IOwnProps {
  uploadType: EKycRequestType;
}

export const KYCAddDocumentsComponent: React.FunctionComponent<
  IStateProps & IDispatchProps & IOwnProps
> = ({ onDropFile, files, fileUploading, uploadType }) => {
  return (
    <MultiFileUpload
      acceptedFiles="image/*,application/pdf"
      onDropFile={onDropFile}
      files={files}
      fileUploading={fileUploading}
      uploadType={uploadType}
      layout="vertical"
    />
  );
};

export const KYCAddDocuments = compose<React.FunctionComponent<IOwnProps>>(
  appConnect<IStateProps, IDispatchProps, IOwnProps>({
    stateToProps: (state, ownProps) => ({
      files:
        ownProps.uploadType === EKycRequestType.INDIVIDUAL
          ? state.kyc.individualFiles
          : state.kyc.businessFiles,
      filesLoading:
        ownProps.uploadType === EKycRequestType.INDIVIDUAL
          ? !!state.kyc.individualFilesLoading
          : !!state.kyc.businessFilesLoading,
      fileUploading:
        ownProps.uploadType === EKycRequestType.INDIVIDUAL
          ? !!state.kyc.individualFileUploading
          : !!state.kyc.businessFileUploading,
      title: "",
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      onDropFile: (file: File) =>
        ownProps.uploadType === EKycRequestType.INDIVIDUAL
          ? dispatch(actions.kyc.kycUploadIndividualDocument(file))
          : dispatch(actions.kyc.kycUploadBusinessDocument(file)),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.kyc.kycLoadIndividualDocumentList()),
  }),
)(KYCAddDocumentsComponent);
