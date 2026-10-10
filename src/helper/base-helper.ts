/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-function-type */
import axios from "axios";
import ResponseModel from "@/models/response.model";
import RequestModel from "@/models/request.model";
import credential from "@/lib/credential";

export interface Config {
    showSuccess?: boolean;
    showError?: boolean;
    usingToken?: boolean;
    token?: string;
    gaSession?: string;
    username?: string;
    password?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUploadProgress?: (e: any) => any;
    _retried?: boolean;
}

type Method =
    | "get" | "GET"
    | "delete" | "DELETE"
    | "head" | "HEAD"
    | "options" | "OPTIONS"
    | "post" | "POST"
    | "put" | "PUT"
    | "patch" | "PATCH"
    | "purge" | "PURGE"
    | "link" | "LINK"
    | "unlink" | "UNLINK";

export interface RequestRetrieve {
    parameter?: Parameter;
    paging?: Paging;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Parameter {
    column?: string[];
    sort?: any;
    data?: any;
    criteria?: any;
    criteriaType?: string;
    filter?: any;
}

interface Paging {
    page?: number;
    limit?: number;
}

class BaseHelper {
    static url = "";

    static async handleResponse(
        status: boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback?: Function,
        config?: Config,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        err?: any
    ): Promise<any> {
        void err;
        void config;
        const responseMap = {
            status,
            data: response?.data,
            message: "",
        };

        if (callback) callback(responseMap);
        else return responseMap;
    }

    static async request(
        method: Method,
        url: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback?: Function,
        config: Config = {
            token: "",
            showSuccess: true,
            showError: true,
            usingToken: true,
            headers: {},
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onUploadProgress: (): any => {},
            _retried: false,
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        const { onUploadProgress = (): any => {} } = config;
        let { headers = {} } = config;

        headers = {
            "Content-Type": "application/json",
            ...headers,
        };

        config = {
            showSuccess: true,
            showError: true,
            usingToken: true,
            ...config,
        };

        if (config.usingToken) {
            const AuthHelper = (await import("./auth-helper")).default;
            const token = await AuthHelper.ensureToken();
            if (token) headers.Authorization = `Bearer ${token}`;
        }

        if (config?.token) headers.Authorization = `Bearer ${config.token}`;

        if (config?.gaSession) headers.GASession = config.gaSession;

        if (config?.username && config?.password) {
            headers.Authorization = `Basic ${config.username}:${config.password}`;
        }

        const client = axios.create({
            baseURL: url,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onUploadProgress: (e: any) => onUploadProgress(e),
        });

        return client({ method, data, headers, responseType: "json" })
            .then(async (response) => this.handleResponse(true, response, callback, config))
            .catch(async (err) => {
                if (err?.response?.status === 401 && config.usingToken && !config._retried) {
                    credential.clearToken();
                    return this.request(method, url, data, callback, { ...config, _retried: true });
                }
                return this.handleResponse(false, err.response, callback, config, err);
            });
    }

    static postBase(
        url: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any,
        callback?: (response: ResponseModel) => any | ResponseModel,
        config?: Config
    ) {
        return this.request("POST", `${this.url}${url}`, data, callback, config);
    }

    static putBase(
        url: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any,
        callback?: (response: ResponseModel) => any | ResponseModel,
        config?: Config
    ) {
        return this.request("PUT", `${this.url}${url}`, data, callback, config);
    }

    static patchBase(
        url: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any,
        callback?: (response: ResponseModel) => any | ResponseModel,
        config?: Config
    ) {
        return this.request("PATCH", `${this.url}${url}`, data, callback, config);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static deleteBase(url: any, callback?: (response: ResponseModel) => any | ResponseModel, config?: Config) {
        return this.request("DELETE", `${this.url}${url}`, null, callback, config);
    }

    static getBase(url: string, callback?: (response: ResponseModel) => any | ResponseModel, config?: Config) {
        return this.request("GET", `${this.url}${url}`, null, callback, config);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static create(data: any, callback?: (response: ResponseModel) => any | ResponseModel, config?: Config) {
        return this.putBase("", { parameter: { data } }, callback, config);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static update(data: any, callback?: (response: ResponseModel) => any | ResponseModel, config?: Config) {
        return this.patchBase("", { parameter: { data } }, callback, config);
    }

    static upload(
        url: string = "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: any,
        callback?: (response: ResponseModel) => any | ResponseModel,
        config?: Config
    ) {
        const formData = new FormData();
        Object.keys(data).forEach((item) => formData.append(item, data[item]));
        return this.request("POST", this.url + url, formData, callback, {
            showSuccess: false,
            showError: false,
            ...config,
            headers: { "Content-Type": `multipart/form-data` },
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static createupdate(data: any, id: any, callback?: (response: ResponseModel) => any | ResponseModel) {
        return this[id ? "update" : "create"](data, callback);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static detail(id: any, callback?: (response: ResponseModel) => any | ResponseModel): ResponseModel {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.getBase(`${id}`, callback, { showSuccess: false, showError: true }) as any;
    }

    static retrieve(data?: RequestModel, callback?: (response: ResponseModel) => any | ResponseModel, config?: Config) {
        return this.list("", data, callback, config);
    }

    static list(
        url: string,
        reqBody?: RequestModel,
        callback?: (response: ResponseModel) => any | ResponseModel,
        config?: Config
    ) {
        const {
            columns = [],
            sort = {},
            criteria = {},
            criteriaType = "OR",
            filter = {},
            data,
            between = {},
            isDistinct = false,
        } = reqBody?.parameter || {};

        reqBody = {
            parameter: {
                columns,
                sort,
                criteria,
                criteriaType,
                filter,
                data,
                between,
                isDistinct,
            },
            paging: {
                page: 1,
                limit: 10,
                ...reqBody?.paging,
            },
        };
        return this.postBase(url, reqBody, callback, { showSuccess: false, showError: false, ...config });
    }
}

export default BaseHelper;
