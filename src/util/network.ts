import axios, { AxiosPromise } from "axios"
import { PagedEntityList, SessionInfo } from '../protocol/response_types'

export default class Network {
    static BaseURL = "http://localhost:8080/api/v1/"

    static request(path: string, method: string, data: any): AxiosPromise {
        return axios({
            method: method,
            url: Network.BaseURL + path,
            data: data
        })
    }

    static get(path: string): AxiosPromise {
        return Network.request(path, "GET", null)
    }

    static post(path: string, data: any): AxiosPromise {
        return Network.request(path, "POST", data)
    }

    static async getPagedData<T>(entity: string): Promise<PagedEntityList<T> > {
        return await (await Network.get(entity)).data
    }

    static async studentLogin(studentNumber: number, password: string): Promise<SessionInfo> {
        return await (await Network.post("login", { 
            role: "student",
            accountNumber: studentNumber,
            password: password
        })).data
    }
}
