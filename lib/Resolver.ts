import config from '../config.json';
import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rcp.js';

import ENSRoot from './ENSRoot.js';

export default class Resolver {
    private readonly currentNetwork: string;
    private contractAddress: string;

    private readonly ltd: string;
    private readonly ethName: string;
    private readonly ethNameLabels: string[];
    private readonly ethNameNode: string;

    constructor(networkName: string = config.defaultNetworkName, ethName: string) {
        this.currentNetwork = networkName;

        this.ltd = utils.getLTDfromDomain(ethName);
        this.ethName = ethName;
        this.ethNameLabels = utils.getLabelsFromDomain(ethName);
        this.ethNameNode = utils.node(this.ethName);
    }

    public async init() {
        await this.getContractAddress();
    }

    public async getAddress() {
        const method = 'addr(bytes32)';
        const methodId = utils.getMethodID(method);

        const data = [methodId, utils.remove0x(this.ethNameNode)].join('');

        const result = await jsonRCP.call({
            networkName: this.currentNetwork,
            to: this.contractAddress,
            data
        });

        return {
            contractAddress: this.contractAddress,
            contractMethod: method,
            result: utils.normalizeHex(result.result)
        }
    }

    public async getContentHash() {
        const method = 'contenthash(bytes32)';
        const methodId = utils.getMethodID(method);

        const data = [methodId, utils.remove0x(this.ethNameNode)].join('');

        const result = await jsonRCP.call({
            networkName: this.currentNetwork,
            to: this.contractAddress,
            data
        });

        const contentHash = utils.decodeContentHash(result.result);

        return {
            contractAddress: this.contractAddress,
            contractMethod: method,
            result: contentHash && utils.getContentHashAsURL(contentHash)
        }
    }

    private async getContractAddress() {
        const ensRoot = new ENSRoot(this.currentNetwork);
        this.contractAddress = (await ensRoot.getResolver(this.ethName)).result;
    }
}
