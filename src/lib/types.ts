export enum EthAddressType {
    name = 'name',
    address = 'address',
    error = 'error'
}

export enum ResolveType {
    forward = 'forward',
    reverse = 'reverse',
    error = 'error'
}

export interface ISetResponse {
    resultName: string;
    result: Response;
}

export interface ISetResponseError {
    resultName: string;
    error: string;
}

export interface IResponse {
    requestedInfo: IResponseRequestedInfo;
    responseInfo: IResponseResponseInfo;
    ethRCP: IEthJSONRCP;
    error?: string;
}

export interface IResponseRequestedInfo {
    address: string;
    processingAddress: string;
}

export interface IEthJSONRCP {
    request: {
        id: number;
        contractAddress: string;
        contractMethod: string;
        payload: string;
        parameters: object;
    },
    response: IJSONRCPResponse
}

export interface IJSONRCPResponse {
    id: number;
    jsonrpc: string;
    result: string;
}

export interface IJSONRCPResponseResult {
    id: number;
    data: IJSONRCPResponse;
}

export interface IResponseResponseInfo {
    result: string | number;
    data?: IAdditionalDataInfo;
    ethRCP: IEthJSONRCP;
    error?: string;
}

export interface IAdditionalDataInfo {
    address?: string;
    addressParent?: string;
    nameMain?: string;
    resolveType? :string;
    reverseAddress?: string;
}
