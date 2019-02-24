import * as React from "react";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { IEtoDocument, immutableDocumentNames } from "../../modules/eto-documents/interfaces";
import { IImmutableFileId } from "../../modules/immutable-file/interfaces";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { getDocumentTemplateTitles } from "../documents/utils";
import { DocumentTemplateButton } from "./DocumentLink";
import { InlineIcon } from "./InlineIcon";

import * as link from "../../assets/img/inline_icons/social_link.svg";
import * as styles from "./SingleColDocumentWidget.module.scss";

interface IOwnProps {
  isRetailEto: boolean;
  documents: IEtoDocument[];
  title: TTranslatedString;
  className?: string;
}
interface IDispatchProps {
  downloadImmutableFile: (fileId: IImmutableFileId, fileName: string) => void;
}

type IProps = IOwnProps & IDispatchProps;

const SingleColDocumentsLayout: React.FunctionComponent<IProps> = ({
  documents,
  className,
  title,
  downloadImmutableFile,
  isRetailEto,
}) => {
  const documentTemplateTitles = getDocumentTemplateTitles(isRetailEto);
  return (
    <div className={className}>
      <h3 className={styles.groupName}>{title}</h3>
      <section className={styles.group}>
        {documents.map(({ ipfsHash, mimeType, documentType }) => {
          return (
            <div className={styles.document} key={ipfsHash}>
              <DocumentTemplateButton
                onClick={() =>
                  downloadImmutableFile(
                    {
                      ...{ ipfsHash, mimeType },
                      asPdf: false,
                    },
                    immutableDocumentNames[documentType],
                  )
                }
                title={documentTemplateTitles[documentType]}
                altIcon={<InlineIcon svgIcon={link} />}
              />
            </div>
          );
        })}
      </section>
    </div>
  );
};

const SingleColDocuments = compose<React.FunctionComponent<IOwnProps>>(
  setDisplayName("SingleColDocuments"),
  appConnect<{}, IDispatchProps>({
    dispatchToProps: dispatch => ({
      downloadImmutableFile: (fileId, name) =>
        dispatch(actions.immutableStorage.downloadImmutableFile(fileId, name)),
    }),
  }),
)(SingleColDocumentsLayout);

export { SingleColDocuments, SingleColDocumentsLayout };
