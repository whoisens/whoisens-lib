import config from '../config.json';
import utils from '../utils/index.js';
import jsonRCP from '../utils/json-rcp.js';

import ENSRoot from './ENSRoot.js';
import {Responder} from './Responder.js';
import {IResponseResponseInfo, EthAddressType} from './types.js';

export default class Registrar extends Responder {
    private readonly currentNetwork: string;
    private contractAddress: string;

    private readonly ltd: string;
    private readonly ethName: string;
    private readonly ethNameHash: string;

    constructor(networkName: string = config.defaultNetworkName, ethAddress: string) {
        super();

        if (utils.getAddressType(ethAddress) !== EthAddressType.name) throw 'Ethereum name should be provided';

        this.currentNetwork = networkName;

        this.ethName = ethAddress;
        this.ltd = utils.getLTDfromDomain(this.ethName);

        const ethNameTopLabel = utils.getLabelsFromDomain(ethAddress).pop();
        this.ethNameHash = utils.hash(ethNameTopLabel);
    }

    public async init() {
        this.contractAddress = await this.getContractAddress();
    }

    public async getOwner(): Promise<IResponseResponseInfo> {
        const method = 'ownerOf(uint256)';
        const methodId = utils.getMethodID(method);

        const data = [methodId, this.ethNameHash].join('');

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
                ethNameHash: this.ethNameHash
            },
            jsonRCPResult: result,
            result: utils.normalizeHex(result.data.result)
        });
    }

    public async getExpirationDate(): Promise<IResponseResponseInfo> {
        const method = 'nameExpires(uint256)';
        const methodId = utils.getMethodID(method);

        const data = [methodId, this.ethNameHash].join('');

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
                ethNameHash: this.ethNameHash
            },
            jsonRCPResult: result,
            result: Number(result.data.result)
        });
    }

    public async getContractAddress(): Promise<string> {
        const ensRoot = new ENSRoot(this.currentNetwork);
        return <string>(await ensRoot.getController(this.ltd)).result;
    }
}
