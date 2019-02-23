import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import {IApiPledge} from "../../../modules/bookbuilding-flow/interfaces/Pledge";
import { withParams } from "../../../utils/withParams";
import { IHttpClient, IHttpResponse } from "../client/IHttpClient";


const BASE_PATH = "/api/eto-listing/";
const MY_PLEDGE_PATH = "/etos/:etoId/pledges/me";

export class EtoPledgeApiError extends Error {}
export class EtoPledgeNotFound extends EtoPledgeApiError {}

@injectable()
export class EtoPledgeApi {
  constructor(
    @inject(symbols.authorizedJsonHttpClient) private authorizedHttpClient: IHttpClient,
  ) {}

  public async getMyPledge(etoId: string): Promise<IHttpResponse<IApiPledge>> {
    const response = await this.authorizedHttpClient.get<IApiPledge>({
      baseUrl: BASE_PATH,
      url: withParams(MY_PLEDGE_PATH, { etoId }),
      allowedStatusCodes: [404],
    });

    if (response.statusCode === 404) {
      throw new EtoPledgeNotFound();
    }

    return response;
  }

  public saveMyPledge(etoId: string, pledge: IApiPledge): Promise<IHttpResponse<IApiPledge>> {
    return this.authorizedHttpClient.put<IApiPledge>({
      baseUrl: BASE_PATH,
      url: withParams(MY_PLEDGE_PATH, { etoId }),
      body: pledge,
    });
  }

  public deleteMyPledge(etoId: string): Promise<IHttpResponse<IApiPledge>> {
    return this.authorizedHttpClient.delete<IApiPledge>({
      baseUrl: BASE_PATH,
      url: withParams(MY_PLEDGE_PATH, { etoId }),
    });
  }
}
