import { NumericString } from "../../../types";

export interface IStateDetailedBookbuildingStats {
  amountEur: NumericString;
  consentToRevealEmail: boolean;
  currency: string;
  email?: string;
  etoId?: string;
  insertedAt: string;
  updatedAt: string;
  userId: string;
}

export interface IApiDetailedBookbuildingStats {
  amountEur: number;
  consentToRevealEmail: boolean;
  currency: string;
  email?: string;
  etoId?: string;
  insertedAt: string;
  updatedAt: string;
  userId: string;
}
