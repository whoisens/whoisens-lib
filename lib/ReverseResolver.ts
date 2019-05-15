import config from '../config.json';
import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rcp.js';

import ENSRoot from './ENSRoot.js';
import {Response} from './ENS.js';

export default class ReverseResolver {
    static REVERSE_DOMAIN = 'addr.reverse';

    private readonly currentNetwork: string;
    private contractAddress: string;

    private readonly address: string;
    private readonly reverseAddress: string;
    private readonly reverseAddressNode: string;

    constructor(networkName: string = config.defaultNetworkName, address: string) {
        this.currentNetwork = networkName;

        this.address = address;
        this.reverseAddress = this.getReverseAddress(utils.remove0x(this.address));
        this.reverseAddressNode = utils.node(this.reverseAddress);
    }

    public async init(): Promise<void> {
        await this.getContractAddress();
    }

    public async getName(): Promise<Response> {
        const method = 'name(bytes32)';
        const methodId = utils.getMethodID(method);

        const data = [methodId, utils.remove0x(this.reverseAddressNode)].join('');

        const result = await jsonRCP.call({
            networkName: this.currentNetwork,
            to: this.contractAddress,
            data
        });

        return {
            contractAddress: this.contractAddress,
            contractMethod: method,
            result: utils.hexToAscii(utils.byteToString(result.result, true)),
            data: {
                reverseAddress: this.reverseAddress
            }
        }
    }

    private async getContractAddress(): Promise<void> {
        const ensRoot = new ENSRoot(this.currentNetwork);
        this.contractAddress = (await ensRoot.getResolver(this.reverseAddress)).result;
    }

    private getReverseAddress(address: string): string {
        return `${address}.${ReverseResolver.REVERSE_DOMAIN}`
    }
}
