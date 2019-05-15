import config from '../config.json';
import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rcp.js';

import ENSRoot from './ENSRoot.js';
import {EthNameType, Response} from './ENS.js';

export default class Registrar {
    private readonly currentNetwork: string;
    private contractAddress: string;

    private readonly ltd: string;
    private readonly ethName: string;
    private readonly ethNameHash: string;

    constructor(networkName: string = config.defaultNetworkName, ethName: string) {
        if (utils.getNameType(ethName) !== EthNameType.name) throw 'Ethereum name shold be provided';

        this.currentNetwork = networkName;

        this.ltd = utils.getLTDfromDomain(ethName);
        this.ethName = utils.getLabelsFromDomain(ethName)[0]; // TODO: add support of sub-domains
        this.ethNameHash = utils.hash(this.ethName);
    }

    public async init() {
        const ensRoot = new ENSRoot(this.currentNetwork);
        this.contractAddress = (await ensRoot.getOwner(this.ltd)).result;
    }

    public async getOwner(): Promise<Response> {
        const method = 'ownerOf(uint256)';
        const methodId = utils.getMethodID(method);

        const data = [methodId, this.ethNameHash].join('');

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

    public async getExpired(): Promise<Response> {
        const method = 'nameExpires(uint256)';
        const methodId = utils.getMethodID(method);

        const data = [methodId, this.ethNameHash].join('');

        const result = await jsonRCP.call({
            networkName: this.currentNetwork,
            to: this.contractAddress,
            data
        });

        return {
            contractAddress: this.contractAddress,
            contractMethod: method,
            result: result.result
        }
    }
}
