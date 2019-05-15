import config from './../config.json';

import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rcp.js';

export default class ENSRoot {
    public currentNetwork: string;

    constructor(networkName: string = config.defaultNetworkName) {
        this.currentNetwork = networkName;
    }

    public async getOwner(ethName) {
        const contractAddress = config.deployments[this.currentNetwork];
        const contractMethod = 'owner(bytes32)';

        const methodId = utils.getMethodID(contractMethod);
        const nameNode = utils.remove0x(utils.node(ethName));

        const data = [methodId, nameNode].join('');

        const result = await jsonRCP.call({
            networkName: this.currentNetwork,
            to: contractAddress,
            data
        });

        return {
            contractAddress,
            contractMethod,
            result: utils.normalizeHex(result.result)
        }
    }

    public async getResolver(ethName) {
        const contractAddress = config.deployments[this.currentNetwork];
        const contractMethod = 'resolver(bytes32)';

        const methodId = utils.getMethodID(contractMethod);
        const nameNode = utils.remove0x(utils.node(ethName));

        const data = [methodId, nameNode].join('');

        const result = await jsonRCP.call({
            networkName: this.currentNetwork,
            to: contractAddress,
            data
        });

        return {
            contractAddress,
            contractMethod,
            result: utils.normalizeHex(result.result)
        }
    }
}
