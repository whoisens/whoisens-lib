import config from './../config.js';
import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rpc.js';

import BaseClass from './BaseClass.js';
import Config from './Config.js';
import {IResponseResponseInfo} from './types.js';

export default class ENSRoot extends BaseClass {
    constructor() {
        super();
    }

    public async getController(address): Promise<IResponseResponseInfo> {
        await this.init();

        const method = 'owner(bytes32)';
        const methodId = utils.getMethodID(method);

        const addressNode = utils.remove0x(utils.node(address));

        const data = `${methodId}${addressNode}`;

        const result = await jsonRCP.getInstance().makeRequest({
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
            result: utils.normalizeHex(result.result)
        });
    }

    public async getResolver(address): Promise<IResponseResponseInfo> {
        await this.init();

        const method = 'resolver(bytes32)';
        const methodId = utils.getMethodID(method);

        const addressNode = utils.remove0x(utils.node(address));

        const data = [methodId, addressNode].join('');

        const result = await jsonRCP.getInstance().makeRequest({
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
            result: utils.normalizeHex(result.result)
        });
    }

    public async findContractAddress(): Promise<string> {
        const networkId = await jsonRCP.getInstance().getNetworkID();
        Config.getInstance().currentNetworkId = networkId;

        return config.networkContract[networkId];
    }

    private async init(): Promise<void> {
        this.contractAddress = Config.getInstance().contractAddress;

        if (!this.contractAddress) {
            this.contractAddress = await this.findContractAddress();
            Config.getInstance().contractAddress = this.contractAddress;
        }
    }
}
