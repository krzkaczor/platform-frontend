import * as React from "react";
import {Modal} from "reactstrap";

import {actions} from "../../modules/actions";
import {IBlPersonProfileModalObject} from '../../modules/person-profile-modal/interfaces'
import {
  selectIsOpen,
  selectPersonProfileModalObj,
} from "../../modules/person-profile-modal/reducer";
import {appConnect} from "../../store";
import {DeepReadonly} from "../../types";
import {ExternalLink} from "../shared/links";
import {SlidePerson} from "../shared/SlidePerson";
import {ModalComponentBody} from "./ModalComponentBody";

import * as styles from "./PersonProfileModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  personProfileModalObj?: DeepReadonly<IBlPersonProfileModalObject>;
}

interface IDispatchProps {
  onDismiss: () => void;
}

const PersonProfileModalComponent: React.FunctionComponent<IStateProps & IDispatchProps> = ({
  onDismiss,
  isOpen,
  personProfileModalObj,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onDismiss} centered>
      <ModalComponentBody onClose={onDismiss}>
        <SlidePerson
          description={(personProfileModalObj && personProfileModalObj.description) || ""}
          socialChannels={(personProfileModalObj && personProfileModalObj.socialChannels) || []}
          role={(personProfileModalObj && personProfileModalObj.role) || ""}
          name={(personProfileModalObj && personProfileModalObj.name) || ""}
          srcSet={{"1x": (personProfileModalObj && personProfileModalObj.image) || ""}}
          layout="vertical"
        />
        <p className={styles.description}>
          {personProfileModalObj && personProfileModalObj.description}
        </p>
        {personProfileModalObj && (
          <div className={styles.linkWrapper}>
            <ExternalLink href={personProfileModalObj.website}>
              {personProfileModalObj.website}
            </ExternalLink>
          </div>
        )}
      </ModalComponentBody>
    </Modal>
  );
};

export const PersonProfileModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isOpen: selectIsOpen(s.personProfileModal),
    personProfileModalObj: selectPersonProfileModalObj(s.personProfileModal),
  }),
  dispatchToProps: dispatch => ({
    onDismiss: () => dispatch(actions.personProfileModal.hidePersonProfileModal()),
  }),
})(PersonProfileModalComponent);
