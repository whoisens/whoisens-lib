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

export interface IENSParams {
    networkURL?: string;
    contractAddress?: string;
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
    error?: object
}

export interface IResponseResponseInfo {
    result?: string | number;
    resultError?: Error;
    data?: IAdditionalDataInfo;
    ethRCP?: IEthJSONRCP;
    error?: string;
}

export interface IAdditionalDataInfo {
    address?: string;
    addressParent?: string;
    addressType?: EthAddressType;
    nameMain?: string;
    resolveType?: string;
    reverseAddress?: string;
}

export class NameIsNotRegisteredError extends Error {
    private readonly code;

    constructor(message = 'Name is not registered') {
        super();

        this.name = 'NameIsNotRegisteredError';
        this.code = 'NAME_IS_NOT_REGISTERED';
        this.message = message;
    }
}

export class ResolverNotSetError extends Error {
    private readonly code;

    constructor(message = 'Resolver is not set') {
        super();

        this.name = 'ResolverNotSetError';
        this.code = 'RESOLVER_NOT_SET';
        this.message = message;
    }
}

export class InvalidEthNameError extends Error {
    private readonly code;

    constructor(recieved, message = 'Invalid address or name') {
        super();

        this.name = 'InvalidEthNameError';
        this.code = 'INVALID_ETH_NAME';
        this.message = message + `. Got: ${recieved}`;
    }
}
