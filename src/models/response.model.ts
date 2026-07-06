
interface Paging {
    limit?: number;
    page?: number;
    totalPage?: number;
    totalRecord?: number;
}

export default interface ResponseModel<T = any> {
    status: boolean;
    data: T;
    paging?: Paging;
    message: string;
    description: string;
    code: any;
}

export type Callback = ((response: ResponseModel) => (any | ResponseModel))

export interface Status {
    responseCode?: any,
    responseMessage?: string
    responseDesc?: string
}

export interface ResponseServicesModel<T = any> {
    status?: Status,
    result?: T,
    paging?: Paging
}