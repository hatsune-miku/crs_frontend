import axios, { AxiosPromise } from "axios";
import { PagedEntityList, LoginResponse } from "../protocol/response_types";

export default class Network {
  static BaseURL = "http://localhost:8080/api/v1/";

  static request(path: string, method: string, data: any): AxiosPromise {
    return axios({
      method: method,
      url: Network.BaseURL + path,
      data: data,
    });
  }

  static get(path: string): AxiosPromise {
    return Network.request(path, "GET", null);
  }

  static post(path: string, data: any): AxiosPromise {
    return Network.request(path, "POST", data);
  }

  static async getPagedData<T>(entity: string): Promise<PagedEntityList<T>> {
    return await (
      await Network.get(entity)
    ).data;
  }

  static async login(loginInfo: {
    role: string;
    sessionId: string | null;
    userId: string;
    password: string | null;
  }): Promise<LoginResponse> {
    return await (
      await Network.post("login", {
        role: loginInfo.role,
        sessionId: loginInfo.sessionId,
        accountNumber: Number.parseInt(loginInfo.userId),
        password: loginInfo.password,
      })
    ).data;
  }
}
