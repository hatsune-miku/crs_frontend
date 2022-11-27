import axios, {AxiosPromise } from "axios";
import { LoginResponse } from "../protocol/response_types";
import Session from "./session";

export default class Network {
  // static BaseURL = "http://45.76.181.130:8080/api/v1/";
  static BaseURL = "http://localhost:8080/api/v1/";

  static friendlyError(error: any, action: string = 'do this'): string {
    if (!error) {
      return "Unknown error.";
    }

    if (error.response) {
      switch (error.response.status) {
        case 401:
        case 500:
          return `You don't have permission to ${action}.`;
        case 404:
          return "The requested resource was not found.";
      }
    }
    return error.message || error.toString();
  }

  static request(path: string, method: string, data: any): AxiosPromise {
    let url = Network.BaseURL + path;
    if (!path.includes("?")) {
      url += '?';
    }
    url += '&sessionId=' + Session.getStoredSessionId();
    return axios({
      method: method,
      url: url,
      data: data,
    });
  }

  static get(path: string): AxiosPromise {
    return Network.request(path, "GET", null);
  }

  static post(path: string, data: any): AxiosPromise {
    return Network.request(path, "POST", data);
  }

  static async getPagedData(entity: string, pageNumber: number, keyword: string = '') {
    return await Network.get(entity + "?page=" + pageNumber + "&search=" + keyword);
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
