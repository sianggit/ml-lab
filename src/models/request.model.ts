export default interface RequestModel {
    parameter?: Parameter;
    paging?: Paging;
}

export interface Parameter {
    columns?: string[];
    sort?: any;
    criteria?: any;
    data?: any;
    criteriaType?: string;
    filter?: any;
    between?: any;
    isDistinct?: boolean;
}

export interface Paging {
    page?: number;
    limit?: number;
}