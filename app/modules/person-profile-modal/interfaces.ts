import { IEtoSocialProfile } from "../../components/shared/SocialProfilesList";

export interface IStatePersonProfileModal {
  isOpen: boolean;
  personProfileModalObj?: IStatePersonProfileModalObject;
}

export interface IBlPersonProfileModal {
  isOpen: boolean;
  personProfileModalObj?: IBlPersonProfileModalObject;
}

export interface IStatePersonProfileModalObject {
  image: string;
  name: string;
  role: string;
  description: string | React.ReactNode; //fixme no reactNodes in state!
  socialChannels: IEtoSocialProfile[]; //fixme this should not be in components
  website?: string;
}

export interface IBlPersonProfileModalObject {
  image: string;
  name: string;
  role: string;
  description: string | React.ReactNode; //fixme no reactNodes in state!
  socialChannels: IEtoSocialProfile[]; //fixme this should not be in components
  website?: string;
}
