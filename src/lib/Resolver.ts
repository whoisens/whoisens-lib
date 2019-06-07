import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rpc.js';

import ENSRoot from './ENSRoot.js';
import BaseClass from './BaseClass.js';
import {IResponseResponseInfo, ResolverNotSetError, ResolveType} from './types.js';

export default class Resolver extends BaseClass {
    private readonly ltd: string;
    private readonly address: string;
    private readonly addressNode: string;

    constructor(address: string) {
        super();

        this.ltd = utils.getLTDfromDomain(address);
        this.address = address;
        this.addressNode = utils.node(this.address);
    }

    public async getAddress(): Promise<IResponseResponseInfo> {
        await this.init();

        if (!utils.isResult(this.contractAddress)) throw new ResolverNotSetError();

        const method = 'addr(bytes32)';
        const methodId = utils.getMethodID(method);

        const addressNode = utils.remove0x(this.addressNode);
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
            result: utils.normalizeHex(result.result),
            data: {
                resolveType: ResolveType.forward
            }
        });
    }

    public async getContentHash(): Promise<IResponseResponseInfo> {
        await this.init();

        const method = 'contenthash(bytes32)';
        const methodId = utils.getMethodID(method);

        const addressNode = utils.remove0x(this.addressNode);
        const data = [methodId, addressNode].join('');

        const result = await jsonRCP.getInstance().makeRequest({
            to: this.contractAddress,
            data
        });

        const contentHash = utils.decodeContentHash(result.result);

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

    public async findContractAddress(): Promise<string> {
        const ensRoot = new ENSRoot();
        return <string>(await ensRoot.getResolver(this.address)).result;
    }

    private async init(): Promise<void> {
        this.contractAddress = await this.findContractAddress();
    }
}
