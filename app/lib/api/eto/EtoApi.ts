import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import {IApiBookBuildingStats} from "../../../modules/bookbuilding-flow/interfaces/BookbuildingStats";
import {IApiDetailedBookbuildingStats} from "../../../modules/bookbuilding-flow/interfaces/DetailedBookbuildingStats";
import {IApiCompanyEtoData} from "../../../modules/eto-flow/interfaces/CompanyEtoData";
import {TApiGeneralEtoData} from "../../../modules/eto-flow/interfaces/interfaces";
import {IApiPublicEtoData} from "../../../modules/eto-flow/interfaces/PublicEtoData";
import {DeepPartial} from "../../../types";
import { withParams } from "../../../utils/withParams";
import { IHttpClient, IHttpResponse } from "../client/IHttpClient";

const BASE_PATH = "/api/eto-listing/";
const COMPANIES_ME_DATA_PATH = "/companies/me";
const COMPANIES_DATA_PATH = "/companies/";
const ETOS_PATH = "/etos";
const ETO_DATA_PATH = "/etos/me";
const ETO_SUBMISSION_PATH = "/etos/me/submission";
const ETO_BOOK_BUILDING_PATH = "/etos/me/bookbuilding";
const ETO_PREVIEW_PATH = "/eto/view/:previewCode";

@injectable()
export class EtoApi {
  constructor(
    @inject(symbols.authorizedJsonHttpClient) private authorizedHttpClient: IHttpClient,
    @inject(symbols.jsonHttpClient) private httpClient: IHttpClient,
  ) {}

  public async getEtos(): Promise<IHttpResponse<DeepPartial<IApiPublicEtoData>>> {
    return await this.authorizedHttpClient.get<DeepPartial<IApiPublicEtoData>>({
      baseUrl: BASE_PATH,
      url: ETOS_PATH,
    });
  }

  public async getMyEto(): Promise<IHttpResponse<DeepPartial<IApiPublicEtoData>>> {
    return await this.authorizedHttpClient.get<DeepPartial<IApiPublicEtoData>>({
      baseUrl: BASE_PATH,
      url: ETO_DATA_PATH,
    });
  }

  public async putMyEto(data: DeepPartial<IApiPublicEtoData>): Promise<IHttpResponse<DeepPartial<IApiPublicEtoData>>> {
    return await this.authorizedHttpClient.put<DeepPartial<IApiPublicEtoData>>({
      baseUrl: BASE_PATH,
      url: ETO_DATA_PATH,
      body: data,
    });
  }

  public async getEtoPreview(previewCode: string): Promise<IHttpResponse<DeepPartial<IApiCompanyEtoData>>> {
    return await this.httpClient.get<DeepPartial<IApiCompanyEtoData>>({
      baseUrl: BASE_PATH,
      url: withParams(ETO_PREVIEW_PATH, { previewCode }),
    });
  }

  public async getEto(etoId: string): Promise<IHttpResponse<DeepPartial<IApiPublicEtoData>>> {
    return await this.httpClient.get<DeepPartial<IApiPublicEtoData>>({
      baseUrl: BASE_PATH,
      url: ETOS_PATH + "/" + etoId,
    });
  }

  public async getCompany(): Promise<IHttpResponse<DeepPartial<IApiCompanyEtoData>>> {
    return await this.authorizedHttpClient.get<DeepPartial<IApiCompanyEtoData>>({
      baseUrl: BASE_PATH,
      url: COMPANIES_ME_DATA_PATH,
    });
  }

  public async getCompanyById(companyId: string): Promise<IHttpResponse<DeepPartial<IApiCompanyEtoData>>> {
    return await this.httpClient.get<DeepPartial<IApiCompanyEtoData>>({
      baseUrl: BASE_PATH,
      url: COMPANIES_DATA_PATH + companyId,
    });
  }

  public async putCompany(
    data: DeepPartial<IApiCompanyEtoData>,
  ): Promise<IHttpResponse<DeepPartial<IApiCompanyEtoData>>> {
    return await this.authorizedHttpClient.put<DeepPartial<IApiCompanyEtoData>>({
      baseUrl: BASE_PATH,
      url: COMPANIES_ME_DATA_PATH,
      body: data,
    });
  }

  public async submitCompanyAndEto(): Promise<IHttpResponse<TApiGeneralEtoData>> {
    return await this.authorizedHttpClient.post<TApiGeneralEtoData>({
      baseUrl: BASE_PATH,
      url: ETO_SUBMISSION_PATH,
    });
  }

  public async changeBookBuildingState(
    isBookBuilding: boolean,
  ): Promise<IHttpResponse<TApiGeneralEtoData>> {
    return await this.authorizedHttpClient.put<TApiGeneralEtoData>({
      baseUrl: BASE_PATH,
      url: ETO_BOOK_BUILDING_PATH,
      body: { is_bookbuilding: isBookBuilding },
    });
  }

  public getBookBuildingStats(etoId: string): Promise<IHttpResponse<IApiBookBuildingStats>> {
    return this.httpClient.get<IApiBookBuildingStats>({
      baseUrl: BASE_PATH,
      url: ETOS_PATH + "/" + etoId + "/bookbuilding-stats",
    });
  }

  public getDetailedBookBuildingStats(): Promise<IHttpResponse<IApiDetailedBookbuildingStats>> {
    return this.authorizedHttpClient.get<any>({
      baseUrl: BASE_PATH,
      url: ETOS_PATH + "/me/pledges",
    });
  }
}
