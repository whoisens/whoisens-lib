import config from './../config.js';

import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rcp.js';

import BaseClass from './BaseClass.js';
import Config from './Config.js';
import {IResponseResponseInfo} from './types.js';

export default class ENSRoot extends BaseClass {
    private readonly contractAddress: string;

    constructor() {
        super();

        this.contractAddress = this.getContractAddress();
    }

    public async getController(address): Promise<IResponseResponseInfo> {
        const method = 'owner(bytes32)';
        const methodId = utils.getMethodID(method);

        const addressNode = utils.remove0x(utils.node(address));

        const data = [methodId, addressNode].join('');

        const result = await jsonRCP.makeRequest({
            url: Config.getInstance().getCurrentNetworkURL(),
            to: this.contractAddress,
            data
        });

        return this.returnResult({
            contractAddress: this.contractAddress,
            contractMethod: method,
            payload: data,
            parameters: {
                methodId,
                addressNode
            },
            jsonRCPResult: result,
            result: utils.normalizeHex(result.data.result)
        });
    }

    public async getResolver(address): Promise<IResponseResponseInfo> {
        const method = 'resolver(bytes32)';
        const methodId = utils.getMethodID(method);

        const addressNode = utils.remove0x(utils.node(address));

        const data = [methodId, addressNode].join('');

        const result = await jsonRCP.makeRequest({
            url: Config.getInstance().getCurrentNetworkURL(),
            to: this.contractAddress,
            data
        });

        return this.returnResult({
            contractAddress: this.contractAddress,
            contractMethod: method,
            payload: data,
            parameters: {
                methodId,
                addressNode
            },
            jsonRCPResult: result,
            result: utils.normalizeHex(result.data.result)
        });
    }

    public getContractAddress(): string {
        return config.deployments[Config.getInstance().getCurrentNetwork()];
    }
}
