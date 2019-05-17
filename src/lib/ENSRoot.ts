import config from './../config.json';

import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rcp.js';

import {Responder} from './Responder.js';
import {IResponseResponseInfo} from './types.js';

export default class ENSRoot extends Responder {
    private readonly currentNetwork: string;
    private readonly contractAddress: string;

    constructor(networkName: string = config.defaultNetworkName) {
        super();

        this.currentNetwork = networkName;
        this.contractAddress = this.getContractAddress();
    }

    public async getController(ethName): Promise<IResponseResponseInfo> {
        const method = 'owner(bytes32)';
        const methodId = utils.getMethodID(method);

        const nameNode = utils.remove0x(utils.node(ethName));

        const data = [methodId, nameNode].join('');

        const result = await jsonRCP.makeRequest({
            networkName: this.currentNetwork,
            to: this.contractAddress,
            data
        });

        return this.returnResult({
            contractAddress: this.contractAddress,
            contractMethod: method,
            payload: data,
            parameters: {
                methodId,
                nameNode
            },
            jsonRCPResult: result,
            result: utils.normalizeHex(result.data.result)
        });
    }

    public async getResolver(ethName): Promise<IResponseResponseInfo> {
        const method = 'resolver(bytes32)';
        const methodId = utils.getMethodID(method);

        const nameNode = utils.remove0x(utils.node(ethName));

        const data = [methodId, nameNode].join('');

        const result = await jsonRCP.makeRequest({
            networkName: this.currentNetwork,
            to: this.contractAddress,
            data
        });

        return this.returnResult({
            contractAddress: this.contractAddress,
            contractMethod: method,
            payload: data,
            parameters: {
                methodId,
                nameNode
            },
            jsonRCPResult: result,
            result: utils.normalizeHex(result.data.result)
        });
    }

    public getContractAddress(): string {
        return config.deployments[this.currentNetwork];
    }
}
