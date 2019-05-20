import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rcp.js';

import ENSRoot from './ENSRoot.js';
import BaseClass from './BaseClass.js';
import Config from './Config.js';
import {IResponseResponseInfo, ResolveType} from './types.js';

export default class Resolver extends BaseClass {
    private contractAddress: string;

    private readonly ltd: string;
    private readonly address: string;
    private readonly addressNode: string;

    constructor(address: string) {
        super();

        this.ltd = utils.getLTDfromDomain(address);
        this.address = address;
        this.addressNode = utils.node(this.address);
    }

    public async init(): Promise<void> {
        this.contractAddress = await this.getContractAddress();
    }

    public async getAddress(): Promise<IResponseResponseInfo> {
        const method = 'addr(bytes32)';
        const methodId = utils.getMethodID(method);

        const addressNode = utils.remove0x(this.addressNode);
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
            result: utils.normalizeHex(result.data.result),
            data: {
                resolveType: ResolveType.forward
            }
        });
    }

    public async getContentHash(): Promise<IResponseResponseInfo> {
        const method = 'contenthash(bytes32)';
        const methodId = utils.getMethodID(method);

        const addressNode = utils.remove0x(this.addressNode);
        const data = [methodId, addressNode].join('');

        const result = await jsonRCP.makeRequest({
            url: Config.getInstance().getCurrentNetworkURL(),
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
                addressNode
            },
            jsonRCPResult: result,
            result: contentHash && utils.getContentHashAsURL(contentHash)
        });
    }

    public async getContractAddress(): Promise<string> {
        const ensRoot = new ENSRoot();
        return <string>(await ensRoot.getResolver(this.address)).result;
    }
}
