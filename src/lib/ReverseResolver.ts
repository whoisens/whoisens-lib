import config from '../config.json';
import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rcp.js';

import ENSRoot from './ENSRoot.js';
import {Responder} from './Responder.js';
import {IResponseResponseInfo, ResolveType} from './types.js';

export default class ReverseResolver extends Responder {
    static REVERSE_DOMAIN = 'addr.reverse';

    private readonly currentNetwork: string;
    private contractAddress: string;

    private readonly address: string;
    private readonly reverseAddress: string;
    private readonly reverseAddressNode: string;

    constructor(networkName: string = config.defaultNetworkName, address: string) {
        super();

        this.currentNetwork = networkName;

        this.address = address;
        this.reverseAddress = this.getReverseAddress(utils.remove0x(this.address));
        this.reverseAddressNode = utils.node(this.reverseAddress);
    }

    public async init(): Promise<void> {
        this.contractAddress = await this.getContractAddress();
    }

    public async getName(): Promise<IResponseResponseInfo> {
        const method = 'name(bytes32)';
        const methodId = utils.getMethodID(method);

        const reverseAddressNode = utils.remove0x(this.reverseAddressNode);
        const data = [methodId, reverseAddressNode].join('');

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
                reverseAddressNode
            },
            jsonRCPResult: result,
            result: utils.hexToAscii(utils.byteToString(result.data.result, true)),
            data: {
                resolveType: ResolveType.reverse,
                reverseAddress: this.reverseAddress
            }
        });
    }

    private async getContractAddress(): Promise<string> {
        const ensRoot = new ENSRoot(this.currentNetwork);
        return <string>(await ensRoot.getResolver(this.reverseAddress)).result;
    }

    private getReverseAddress(address: string): string {
        return `${address}.${ReverseResolver.REVERSE_DOMAIN}`
    }
}
