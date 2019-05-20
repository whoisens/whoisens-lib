import {IAdditionalDataInfo, IJSONRCPResponseResult} from './types';
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
    public returnResult(params: IReturnResultParams) {
        return {
            ethRCP: {
                request: {
                    id: params.jsonRCPResult.id,
                    contractAddress: params.contractAddress,
                    contractMethod: params.contractMethod,
                    payload: params.payload,
                    parameters: params.parameters
                },
                response: params.jsonRCPResult.data
            },
            result: params.result,
            data: params.data
        };
    }
}
