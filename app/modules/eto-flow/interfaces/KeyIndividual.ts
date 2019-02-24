import * as socialChannelInterfaces from "./SocialChannel";

export interface IStateKeyIndividual {
  name: string;
  role: string;
  image: string;
  description: string;
  website: string;
  socialChannels: socialChannelInterfaces.IStateSocialChannel[];
}

export interface IApiKeyIndividual {
  name: string;
  role: string;
  image: string;
  description: string;
  website: string;
  socialChannels: socialChannelInterfaces.IApiSocialChannel[];
}

export interface IBlKeyIndividual {
  name: string;
  role: string;
  image: string;
  description: string;
  website: string;
  socialChannels: socialChannelInterfaces.IBlSocialChannel[];
}
