import {IAdditionalDataInfo, IJSONRCPResponse, IResponseResponseInfo} from './types';
import EventEmitter from 'events';

export interface IReturnResultParams {
    contractAddress: string;
    contractMethod: string;
    payload: string;
    parameters: object;
    jsonRCPResult: IJSONRCPResponse;
    result: string | number;
    resultError?: Error;
    data?: IAdditionalDataInfo;
}

export default class BaseClass extends EventEmitter {
    protected contractAddress: string;

    public returnResult(params: IReturnResultParams): IResponseResponseInfo {
        const response = params.jsonRCPResult;

        const output = {
            ethRCP: {
                request: {
                    id: params.jsonRCPResult.id,
                    contractAddress: params.contractAddress,
                    contractMethod: params.contractMethod,
                    payload: params.payload,
                    parameters: params.parameters
                },
                response: response
            },
            result: params.result,
            data: params.data
        };

        if (params.resultError) output['resultError'] = params.resultError;
        if (response.error) output['error'] = JSON.stringify(response.error);

        return output;
    }

    getContractAddress() {
        return this.contractAddress;
    }
}
