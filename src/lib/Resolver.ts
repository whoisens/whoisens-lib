import config from '../config.json';
import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rcp.js';

import ENSRoot from './ENSRoot.js';
import {Responder} from './Responder.js';
import {IResponseResponseInfo, ResolveType} from './types.js';

export default class Resolver extends Responder {
    private readonly currentNetwork: string;
    private contractAddress: string;

    private readonly ltd: string;
    private readonly ethName: string;
    private readonly ethNameNode: string;

    constructor(networkName: string = config.defaultNetworkName, ethName: string) {
        super();

        this.currentNetwork = networkName;

        this.ltd = utils.getLTDfromDomain(ethName);
        this.ethName = ethName;
        this.ethNameNode = utils.node(this.ethName);
    }

    public async init(): Promise<void> {
        this.contractAddress = await this.getContractAddress();
    }

    public async getAddress(): Promise<IResponseResponseInfo> {
        const method = 'addr(bytes32)';
        const methodId = utils.getMethodID(method);

        const ethNameNode = utils.remove0x(this.ethNameNode);
        const data = [methodId, ethNameNode].join('');

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
                ethNameNode
            },
            jsonRCPResult: result,
            result: utils.normalizeHex(result.data.result),
            data: {
                resolveType: ResolveType.forward
            }
        });
    }

    public async getContentHash(): Promise<IResponseResponseInfo> {
        const method = 'contenthash(bytes32)';
        const methodId = utils.getMethodID(method);

        const ethNameNode = utils.remove0x(this.ethNameNode);
        const data = [methodId, ethNameNode].join('');

        const result = await jsonRCP.makeRequest({
            networkName: this.currentNetwork,
            to: this.contractAddress,
            data
        });

        const contentHash = utils.decodeContentHash(result.data.result);

        return this.returnResult({
            contractAddress: this.contractAddress,
            contractMethod: method,
            payload: data,
            parameters: {
                methodId,
                ethNameNode
            },
            jsonRCPResult: result,
            result: contentHash && utils.getContentHashAsURL(contentHash)
        });
    }

    public async getContractAddress(): Promise<string> {
        const ensRoot = new ENSRoot(this.currentNetwork);
        return <string>(await ensRoot.getResolver(this.ethName)).result;
    }
}
