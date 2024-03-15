export interface IQueryId {
    id: string;
}

export interface IQueryIds {
    ids: string[];
}

export interface IQueryStatus {
    error: boolean
    internalMsg: string
    errMsg: string|null
    payload: any
    httpCode: number
}