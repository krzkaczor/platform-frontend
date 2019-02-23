import {IBlEtoTokenData} from "../../public-etos/interfaces/EtoTokenData";
import {TBlEtoWithCompanyAndContract, TStateEtoWithCompanyAndContract} from "../../public-etos/interfaces/interfaces";
import {IBlInvestorTicket, IStateInvestorTicket} from './InvestorTicket'


export type TStateETOWithInvestorTicket = TStateEtoWithCompanyAndContract & {
  investorTicket: IStateInvestorTicket;
};

export type TBlETOWithInvestorTicket = TBlEtoWithCompanyAndContract & {
  investorTicket: IBlInvestorTicket;
};

export type TBlETOWithTokenData = TBlETOWithInvestorTicket & {
  tokenData: IBlEtoTokenData;
};

