import {
  compose,
  lifecycle,
  StateHandler,
  withHandlers,
  withProps,
  withStateHandlers,
} from "recompose";

import { actions } from "../../../../../modules/actions";
import { appConnect } from "../../../../../store";
import { ECurrency } from "../../../../shared/Money";
import {
  CampaigningActivatedInvestorApprovedWidgetLayout,
  CampaigningFormState,
  ICampaigningActivatedInvestorWidgetLayoutProps,
} from "./CampaigningActivatedInvestorApprovedWidgetLayout";
import {IBlPledge, blToStateConversionSpec} from "../../../../../modules/bookbuilding-flow/interfaces/Pledge";
import {convert} from "../../../utils";
import BigNumber from "bignumber.js";

export interface IExternalProps {
  etoId: string;
  minPledge: BigNumber;
  maxPledge?: BigNumber;
  pledge?: IBlPledge;
}

interface IDispatchProps {
  savePledge: (newPledge: IBlPledge) => void;
  deletePledge: () => void;
}

interface IHandlersProps {
  showMyEmail: (consentToRevealEmail: boolean) => void;
  backNow: (amount: BigNumber) => void;
  changePledge: () => void;
}

interface IWithProps {
  pledgedAmount: BigNumber | null;
}

interface ILocalStateProps {
  consentToRevealEmail: boolean;
  formState: CampaigningFormState;
}

type ILocalStateHandlersProps = {
  changeConsentToRevealEmail: StateHandler<ILocalStateProps>;
  moveToEdit: StateHandler<ILocalStateProps>;
  moveToView: StateHandler<ILocalStateProps>;
};

const CampaigningActivatedInvestorApprovedWidget = compose<
  ICampaigningActivatedInvestorWidgetLayoutProps,
  IExternalProps
>(
  appConnect<{}, IDispatchProps, IExternalProps>({
    dispatchToProps: (dispatch, props) => ({
      savePledge: (newPledge: IBlPledge) => {
        dispatch(actions.bookBuilding.savePledge(props.etoId, convert(newPledge, blToStateConversionSpec)));
      },
      deletePledge: () => {
        dispatch(actions.bookBuilding.deletePledge(props.etoId));
      },
    }),
  }),
  withStateHandlers<ILocalStateProps, ILocalStateHandlersProps>(
    {
      consentToRevealEmail: false,
      formState: CampaigningFormState.EDIT,
    },
    {
      changeConsentToRevealEmail: () => (consentToRevealEmail: boolean) => ({
        consentToRevealEmail,
      }),
      moveToEdit: () => () => ({ formState: CampaigningFormState.EDIT }),
      moveToView: () => () => ({ formState: CampaigningFormState.VIEW }),
    },
  ),
  lifecycle<ILocalStateHandlersProps & IExternalProps, {}>({
    componentDidUpdate(prevProps): void {
      const pledge = this.props.pledge;

      if (prevProps.pledge !== pledge) {
        if (pledge) {
          this.props.moveToView();
          this.props.changeConsentToRevealEmail(pledge.consentToRevealEmail);
        } else {
          this.props.moveToEdit();
          this.props.changeConsentToRevealEmail(false);
        }
      }
    },
  }),
  withProps<IWithProps, IExternalProps>(({ pledge }) => ({
    pledgedAmount: pledge ? pledge.amountEur : null,
  })),
  withHandlers<
    IExternalProps &
      IDispatchProps &
      ILocalStateProps &
      ILocalStateHandlersProps &
      ILocalStateProps,
    IHandlersProps
  >({
    showMyEmail: ({ pledge, savePledge, changeConsentToRevealEmail }) => (
      consentToRevealEmail: boolean,
    ) => {
      changeConsentToRevealEmail(consentToRevealEmail);

      // only save when already pledged
      if (pledge) {
        const newPledge: IBlPledge = { ...pledge, consentToRevealEmail };

        savePledge(newPledge);
      }
    },
    backNow: ({ savePledge, consentToRevealEmail }) => (amountEur: BigNumber) => {
      const newPledge: IBlPledge = {
        amountEur,
        consentToRevealEmail,
        currency: ECurrency.EUR_TOKEN,
      };

      savePledge(newPledge);
    },
    changePledge: ({ moveToEdit }) => moveToEdit,
  }),
)(CampaigningActivatedInvestorApprovedWidgetLayout);

export { CampaigningActivatedInvestorApprovedWidget };
