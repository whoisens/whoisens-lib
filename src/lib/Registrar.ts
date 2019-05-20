import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rcp.js';

import ENSRoot from './ENSRoot.js';
import BaseClass from './BaseClass.js';
import Config from './Config.js';
import {IResponseResponseInfo, EthAddressType} from './types.js';

export default class Registrar extends BaseClass {
    private contractAddress: string;

    private readonly ltd: string;
    private readonly address: string;
    private readonly addressHash: string;

    constructor(address: string) {
        super();

        if (utils.getAddressType(address) !== EthAddressType.name) throw 'Ethereum name should be provided';

        this.address = address;
        this.ltd = utils.getLTDfromDomain(this.address);

        const addressTopLabel = utils.getLabelsFromDomain(address).pop();
        this.addressHash = utils.hash(addressTopLabel);
    }

    public async init() {
        this.contractAddress = await this.getContractAddress();
    }

    public async getOwner(): Promise<IResponseResponseInfo> {
        const method = 'ownerOf(uint256)';
        const methodId = utils.getMethodID(method);

        const data = [methodId, this.addressHash].join('');

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
                addressHash: this.addressHash
            },
            jsonRCPResult: result,
            result: utils.normalizeHex(result.data.result)
        });
    }

    public async getExpirationDate(): Promise<IResponseResponseInfo> {
        const method = 'nameExpires(uint256)';
        const methodId = utils.getMethodID(method);

        const data = [methodId, this.addressHash].join('');

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
                addressHash: this.addressHash
            },
            jsonRCPResult: result,
            result: Number(result.data.result)
        });
    }

    public async getContractAddress(): Promise<string> {
        const ensRoot = new ENSRoot();
        return <string>(await ensRoot.getController(this.ltd)).result;
    }
}
