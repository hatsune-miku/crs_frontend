import axios, { AxiosPromise } from "axios";
import { PagedEntityList, LoginResponse } from "../protocol/response_types";

export default class Network {
  // static BaseURL = "http://45.76.181.130:8080/api/v1/";
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

  static async getPagedData<T>(entity: string, pageNumber: number, keyword: string = ''): Promise<PagedEntityList<T> > {
    return (await Network.get(entity + "?page=" + pageNumber + "&search=" + keyword)).data;
  }

  static async getOne<T>(entity: string, indexItem: string | number): Promise<T> {
    return (await Network.get(entity + "/" + indexItem.toString())).data;
  }

  static async deleteOne(entity: string, indexItem: string): Promise<void> {
    await Network.request(entity + "/" + indexItem, "DELETE", null);
  }

  static async addOne(entity: string, data: any): Promise<void> {
    await Network.post(entity, data);
  }

  static async updateOne<T>(entity: string, id: string, data: T): Promise<void> {
    await Network.request(entity + "/" + id, "PUT", data);
  }

  static async login(loginInfo: {
    role: string;
    sessionId: string | null;
    accountNumber: string;
    password: string | null;
  }): Promise<LoginResponse> {
    return await (
      await Network.post("login", {
        role: loginInfo.role,
        sessionId: loginInfo.sessionId,
        accountNumber: Number.parseInt(loginInfo.accountNumber),
        password: loginInfo.password,
      })
    ).data;
  }
}
