import {IAdditionalDataInfo, IJSONRCPResponseResult, IResponseResponseInfo} from './types';
import EventEmitter from 'events';

export interface IReturnResultParams {
    contractAddress: string;
    contractMethod: string;
    payload: string;
    parameters: object;
    jsonRCPResult: IJSONRCPResponseResult;
    result: string | number;
    data?: IAdditionalDataInfo;
}

export default class BaseClass extends EventEmitter {
    public returnResult(params: IReturnResultParams): IResponseResponseInfo {
        const response = params.jsonRCPResult.data;

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

        if (response.error) output['error'] = JSON.stringify(response.error);

        return output;
    }
}
