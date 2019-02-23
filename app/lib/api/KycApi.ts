import {inject, injectable} from "inversify";

import {symbols} from "../../di/symbols";
import {IHttpClient, IHttpResponse} from "./client/IHttpClient";

import {
  IKycBeneficialOwner,
  IKycBusinessData,
  IKycFileInfo,
  IKycIndividualData,
  IKycLegalRepresentative,
  IKycRequestState,
} from "../../modules/kyc/interfaces";
import {KycBankAccountValidator} from "../../modules/kyc/validators";
import {
  KycFileInfoValidator, //FIXME need special validators for api
  KycIndividualDataValidator,
  KycLegalRepresentativeValidator,
  KycRequestStateValidator,
} from "../../modules/kyc/validators"

const BASE_PATH = "/api/kyc/";

const INDIVIDUAL_DATA_PATH = "/individual/data";
const INDIVIDUAL_REQUEST_PATH = "/individual/request";
const INSTANT_ID_REQUEST_PATH = "/individual/request/instant-id";
const INDIVIDUAL_DOCUMENT_PATH = "/individual/document";

const BUSINESS_REQUEST_PATH = "/business/request";
const BUSINESS_DATA_PATH = "/business/data";
const BUSINESS_DOCUMENT_PATH = "/business/document";
const LEGAL_REPRESENTATIVE_PATH = "/business/legal-representative";
const LEGAL_REPRESENTATIVE_DOCUMENT_PATH = "/business/legal-representative/document";

const BENEFICIAL_OWNER_PATH = "/business/beneficial-owner";
const BENEFICIAL_OWNER_ENTRY_PATH = "/beneficial-owner/";
const BENEFICIAL_OWNER_DOCUMENT_PATH = "/beneficial-owner/{boid}/document";

const BANK_ACCOUNT_PATH = "/bank-account";

export class KycApiError extends Error {}
export class BankAccountNotFound extends KycApiError {}

@injectable()
export class KycApi {
  constructor(@inject(symbols.authorizedJsonHttpClient) private httpClient: IHttpClient) {}

  /**
   * Individual Requests
   */
  // data
  public async getIndividualData(): Promise<IHttpResponse<IKycBusinessData>> {
    return await this.httpClient.get<IKycBusinessData>({
      baseUrl: BASE_PATH,
      url: INDIVIDUAL_DATA_PATH,
      responseSchema: KycIndividualDataValidator,
    });
  }

  public async putIndividualData(
    data: IKycIndividualData,
  ): Promise<IHttpResponse<IKycIndividualData>> {
    return await this.httpClient.put<IKycIndividualData>({
      baseUrl: BASE_PATH,
      url: INDIVIDUAL_DATA_PATH,
      body: data,
      responseSchema: KycIndividualDataValidator,
    });
  }

  // documents
  public async getIndividualDocuments(): Promise<IHttpResponse<IKycFileInfo[]>> {
    return await this.httpClient.get<IKycFileInfo[]>({
      baseUrl: BASE_PATH,
      url: INDIVIDUAL_DOCUMENT_PATH,
    });
  }

  public async uploadIndividualDocument(file: File): Promise<IHttpResponse<IKycFileInfo>> {
    let data = new FormData();
    data.append("file", file);

    return await this.httpClient.post<IKycFileInfo>({
      baseUrl: BASE_PATH,
      url: INDIVIDUAL_DOCUMENT_PATH,
      formData: data,
      responseSchema: KycFileInfoValidator,
    });
  }

  // request
  public async getIndividualRequest(): Promise<IHttpResponse<IKycRequestState>> {
    return await this.httpClient.get<IKycRequestState>({
      baseUrl: BASE_PATH,
      url: INDIVIDUAL_REQUEST_PATH,
      responseSchema: KycRequestStateValidator,
    });
  }

  public async submitIndividualRequest(): Promise<IHttpResponse<IKycRequestState>> {
    return await this.httpClient.put<IKycRequestState>({
      baseUrl: BASE_PATH,
      url: INDIVIDUAL_REQUEST_PATH,
      responseSchema: KycRequestStateValidator,
    });
  }

  public async startInstantId(): Promise<IHttpResponse<IKycRequestState>> {
    return await this.httpClient.put<IKycRequestState>({
      baseUrl: BASE_PATH,
      url: INSTANT_ID_REQUEST_PATH,
      responseSchema: KycRequestStateValidator,
    });
  }

  public async cancelInstantId(): Promise<IHttpResponse<void>> {
    return await this.httpClient.delete<void>({
      baseUrl: BASE_PATH,
      url: INSTANT_ID_REQUEST_PATH,
    });
  }

  /**
   * Business requests
   */

  // legal representative
  public async getLegalRepresentative(): Promise<IHttpResponse<IKycLegalRepresentative>> {
    return await this.httpClient.get<IKycLegalRepresentative>({
      baseUrl: BASE_PATH,
      url: LEGAL_REPRESENTATIVE_PATH,
      responseSchema: KycLegalRepresentativeValidator,
    });
  }

  public async putLegalRepresentative(
    data: IKycLegalRepresentative,
  ): Promise<IHttpResponse<IKycLegalRepresentative>> {
    return await this.httpClient.put<IKycLegalRepresentative>({
      baseUrl: BASE_PATH,
      url: LEGAL_REPRESENTATIVE_PATH,
      body: data,
      responseSchema: KycLegalRepresentativeValidator,
    });
  }

  public async getLegalRepresentativeDocuments(): Promise<IHttpResponse<IKycFileInfo[]>> {
    return await this.httpClient.get<IKycFileInfo[]>({
      baseUrl: BASE_PATH,
      url: LEGAL_REPRESENTATIVE_DOCUMENT_PATH,
    });
  }

  public async uploadLegalRepresentativeDocument(file: File): Promise<IHttpResponse<IKycFileInfo>> {
    let data = new FormData();
    data.append("file", file);

    return await this.httpClient.post<IKycFileInfo>({
      baseUrl: BASE_PATH,
      url: LEGAL_REPRESENTATIVE_DOCUMENT_PATH,
      formData: data,
      responseSchema: KycFileInfoValidator,
    });
  }

  // data
  public async getBusinessData(): Promise<IHttpResponse<IKycBusinessData>> {
    return await this.httpClient.get<IKycBusinessData>({
      baseUrl: BASE_PATH,
      url: BUSINESS_DATA_PATH,
    });
  }

  public async putBusinessData(data: IKycBusinessData): Promise<IHttpResponse<IKycBusinessData>> {
    return await this.httpClient.put<IKycBusinessData>({
      baseUrl: BASE_PATH,
      url: BUSINESS_DATA_PATH,
      body: data,
    });
  }

  public async getBusinessDocuments(): Promise<IHttpResponse<IKycFileInfo[]>> {
    return await this.httpClient.get<IKycFileInfo[]>({
      baseUrl: BASE_PATH,
      url: BUSINESS_DOCUMENT_PATH,
    });
  }

  public async uploadBusinessDocument(file: File): Promise<IHttpResponse<IKycFileInfo>> {
    let data = new FormData();
    data.append("file", file);

    return await this.httpClient.post<IKycFileInfo>({
      baseUrl: BASE_PATH,
      url: BUSINESS_DOCUMENT_PATH,
      formData: data,
      responseSchema: KycFileInfoValidator,
    });
  }

  // beneficial owners
  public async getBeneficialOwners(): Promise<IHttpResponse<IKycBeneficialOwner[]>> {
    return await this.httpClient.get<IKycBeneficialOwner[]>({
      baseUrl: BASE_PATH,
      url: BENEFICIAL_OWNER_PATH,
    });
  }

  public async postBeneficialOwner(
    beneficialOwner: IKycBeneficialOwner,
  ): Promise<IHttpResponse<IKycBeneficialOwner>> {
    return await this.httpClient.post<IKycBeneficialOwner>({
      baseUrl: BASE_PATH,
      url: BENEFICIAL_OWNER_PATH,
      body: beneficialOwner,
    });
  }

  public async putBeneficialOwner(
    beneficialOwner: IKycBeneficialOwner,
  ): Promise<IHttpResponse<IKycBeneficialOwner>> {
    return await this.httpClient.put<IKycBeneficialOwner>({
      baseUrl: BASE_PATH,
      url: BENEFICIAL_OWNER_ENTRY_PATH + (beneficialOwner.id || ""),
      body: beneficialOwner,
    });
  }

  public async deleteBeneficialOwner(id: string): Promise<IHttpResponse<{}>> {
    return await this.httpClient.delete<{}>({
      baseUrl: BASE_PATH,
      url: BENEFICIAL_OWNER_ENTRY_PATH + id,
    });
  }

  public async getBeneficialOwnerDocuments(boid: string): Promise<IHttpResponse<IKycFileInfo[]>> {
    return await this.httpClient.get<IKycFileInfo[]>({
      baseUrl: BASE_PATH,
      url: BENEFICIAL_OWNER_DOCUMENT_PATH.replace("{boid}", boid),
    });
  }

  public async uploadBeneficialOwnerDocument(
    boid: string,
    file: File,
  ): Promise<IHttpResponse<IKycFileInfo>> {
    let data = new FormData();
    data.append("file", file);

    return await this.httpClient.post<IKycFileInfo>({
      baseUrl: BASE_PATH,
      url: BENEFICIAL_OWNER_DOCUMENT_PATH.replace("{boid}", boid),
      formData: data,
      responseSchema: KycFileInfoValidator,
    });
  }

  // request
  public async getBusinessRequest(): Promise<IHttpResponse<IKycRequestState>> {
    return await this.httpClient.get<IKycRequestState>({
      baseUrl: BASE_PATH,
      url: BUSINESS_REQUEST_PATH,
      responseSchema: KycRequestStateValidator,
    });
  }

  public async submitBusinessRequest(): Promise<IHttpResponse<IKycRequestState>> {
    return await this.httpClient.put<IKycRequestState>({
      baseUrl: BASE_PATH,
      url: BUSINESS_REQUEST_PATH,
      responseSchema: KycRequestStateValidator,
    });
  }

  /**
   * Bank account
   */

  public async getBankAccount(): Promise<IKycRequestState> {
    const response = await this.httpClient.get<IKycRequestState>({
      baseUrl: BASE_PATH,
      url: BANK_ACCOUNT_PATH,
      responseSchema: KycBankAccountValidator,
      allowedStatusCodes: [404],
    });

    if (response.statusCode === 404) {
      throw new BankAccountNotFound();
    }

    return response.body;
  }
}
