import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rpc.js';

import ENSRoot from './ENSRoot.js';
import BaseClass from './BaseClass.js';
import {IResponseResponseInfo, ResolverNotSetError, ResolveType} from './types.js';

export default class ReverseResolver extends BaseClass {
    static REVERSE_DOMAIN = 'addr.reverse';

    private readonly address: string;
    private readonly reverseAddress: string;
    private readonly reverseAddressNode: string;

    constructor(address: string) {
        super();

        this.address = address;
        this.reverseAddress = this.getReverseAddress(utils.remove0x(this.address));
        this.reverseAddressNode = utils.node(this.reverseAddress);
    }

    public async getName(): Promise<IResponseResponseInfo> {
        await this.init();

        if (!utils.isResult(this.contractAddress)) throw new ResolverNotSetError();

        const method = 'name(bytes32)';
        const methodId = utils.getMethodID(method);

        const reverseAddressNode = utils.remove0x(this.reverseAddressNode);
        const data = [methodId, reverseAddressNode].join('');

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
                reverseAddressNode
            },
            jsonRCPResult: result,
            result: utils.hexToAscii(utils.byteToString(result.result, true)),
            data: {
                resolveType: ResolveType.reverse,
                reverseAddress: this.reverseAddress
            }
        });
    }

    private async findContractAddress(): Promise<string> {
        const ensRoot = new ENSRoot();
        return <string>(await ensRoot.getResolver(this.reverseAddress)).result;
    }

    private getReverseAddress(address: string): string {
        return `${address}.${ReverseResolver.REVERSE_DOMAIN}`
    }

    private async init(): Promise<void> {
        this.contractAddress = await this.findContractAddress();
    }
}
