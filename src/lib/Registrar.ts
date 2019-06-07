import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rpc.js';

import ENSRoot from './ENSRoot.js';
import BaseClass from './BaseClass.js';
import {
    IResponseResponseInfo,
    EthAddressType,
    InvalidEthNameError,
    NameIsNotRegisteredError
} from './types.js';

export default class Registrar extends BaseClass {
    private readonly ltd: string;
    private readonly address: string;
    private readonly addressHash: string;

    constructor(address: string) {
        super();

        if (utils.getAddressType(address) !== EthAddressType.name) throw new InvalidEthNameError(address, 'Ethereum name should be provided');

        this.address = address;
        this.ltd = utils.getLTDfromDomain(this.address);

        const addressTopLabel = utils.getLabelsFromDomain(address).pop();
        this.addressHash = utils.hash(addressTopLabel);
    }

    public async getOwner(): Promise<IResponseResponseInfo> {
        await this.init();

        const method = 'ownerOf(uint256)';
        const methodId = utils.getMethodID(method);

        const data = `${methodId}${this.addressHash}`;

        const result = await jsonRCP.getInstance().makeRequest({
            to: this.contractAddress,
            data
        });

        const isResult = utils.isResult(result.result);

        return this.returnResult({
            contractAddress: this.contractAddress,
            contractMethod: method,
            payload: data,
            parameters: {
                methodId,
                addressHash: this.addressHash
            },
            jsonRCPResult: result,
            result: utils.normalizeHex(result.result),
            resultError: !isResult && new NameIsNotRegisteredError()
        });
    }

    public async getExpirationDate(): Promise<IResponseResponseInfo> {
        await this.init();

        const method = 'nameExpires(uint256)';
        const methodId = utils.getMethodID(method);

        const data = [methodId, this.addressHash].join('');

        const result = await jsonRCP.getInstance().makeRequest({
            to: this.contractAddress,
            data
        });

        const timestamp = Number(result.result);
        const isResult = utils.isResult(timestamp);

        return this.returnResult({
            contractAddress: this.contractAddress,
            contractMethod: method,
            payload: data,
            parameters: {
                methodId,
                addressHash: this.addressHash
            },
            jsonRCPResult: result,
            result: timestamp,
            resultError: !isResult && new NameIsNotRegisteredError()
        });
    }

    public async findContractAddress(): Promise<string> {
        const ensRoot = new ENSRoot();
        return <string>(await ensRoot.getController(this.ltd)).result;
    }

    private async init() {
        this.contractAddress = await this.findContractAddress();
    }
}
