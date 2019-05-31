import config from '../config.js';
import {EthAddressType, IResponseResponseInfo} from './types.js';

import ENSRoot from './ENSRoot.js';
import Registrar from './Registrar.js';
import Resolver from './Resolver.js';
import ReverseResolver from './ReverseResolver.js';
import utils from '../utils/index.js';
import BaseClass from './BaseClass.js';
import Config from './Config.js';

export default class ENS extends BaseClass {
    private readonly ENSRoot: ENSRoot;
    private Registrar: Registrar;
    private Resolver: Resolver;
    private ReverseResolver: ReverseResolver;

    /**
     * Store original requested Ethereum Name, as ethAddress could be transform to hex representation if needed
     */
    private ethAddressOriginal: string | undefined;
    private ethAddress: string | undefined;

    private ethAddressType: EthAddressType | undefined;
    private resolveAddress: string | undefined;

    /**
     * @event
     */
    static EVENT_ETH_ADDRESS = 'ethAddress';

    /**
     * @event
     */
    static EVENT_ETH_ADDRESS_TYPE = 'ethAddressType';

    /**
     * @event
     */
    static EVENT_SET_RESPONSE = 'setResponse';

    constructor(networkName: string = config.defaultNetworkName, networkURL: string) {
        super();

        Config.getInstance().setCurrentNetwork(networkName);
        Config.getInstance().setCurrentNetworkURL(networkURL);

        this.ENSRoot = new ENSRoot();
    }

    getEthAddressType(): EthAddressType {
        return this.ethAddressType;
    }

    /**
     * Init with eth address
     *
     * @fires ENS.EVENT_ETH_NAME
     * @fires ENS.EVENT_ETH_NAME_TYPE
     */
    public init(ethAddress: string): void {
        this.ethAddressOriginal = ethAddress;
        this.ethAddress = ethAddress;

        this.emit(ENS.EVENT_ETH_ADDRESS, this.ethAddress);

        this.ethAddressType = utils.getAddressType(this.ethAddress);
        this.emit(ENS.EVENT_ETH_ADDRESS_TYPE, this.ethAddressType);
        if (this.ethAddressType === EthAddressType.error) throw `Invalid address or name. Got: ${this.ethAddress}`;

        this.ethAddress = utils.reverseAddressToHex(this.ethAddress);
    }

    public async getInfo() {
        if (!this.ethAddress || !this.ethAddressType) throw 'Please call init before';

        let controllerResult;
        let ownerResult;
        let resolverAddress;

        if (this.ethAddressType === EthAddressType.error) return;

        if (this.ethAddressType === EthAddressType.name) {
            controllerResult = await this.getController();
            if (!utils.isResult(controllerResult.result)) return;

            ownerResult = await this.getOwner();
            if (!ownerResult.result) return;

            await this.getExpirationDate();
            resolverAddress = await this.getAddress();
            await this.getContentHash();

            if (!utils.isResult(resolverAddress.result)) return;

            this.resolveAddress = resolverAddress.result;
        }

        await this.getReverseRecord();
    }

    /**
     * Get controller address.
     *
     * @fires ENS.EVENT_SET_RESPONSE
     * @type {object}
     * @property resultName {string} controllerResult
     *
     * @return Promise<Response>
     */
    public async getController(): Promise<IResponseResponseInfo> {
        const EVENT_PROPERTY = 'controllerResult';

        try {
            const controllerResult = await this.ENSRoot.getController(this.ethAddress);

            return this.sendResponse(EVENT_PROPERTY, controllerResult);
        } catch(error) {
            this.sendError(EVENT_PROPERTY, error);
        }
    }

    /**
     * Get Registrar owner.
     *
     * @fires ENS.EVENT_SET_RESPONSE
     * @type {object}
     * @property resultName {string} registrarOwnerResult
     *
     * @return Promise<Response>
     */
    public async getOwner(): Promise<IResponseResponseInfo> {
        const EVENT_PROPERTY = 'ownerResult';

        try {
            this.Registrar = new Registrar(this.ethAddress);
            await this.Registrar.init();

            const registrarOwnerResult = await this.Registrar.getOwner();
            return this.sendResponse(EVENT_PROPERTY, registrarOwnerResult);
        } catch(error) {
            this.sendError(EVENT_PROPERTY, error);
        }
    }

    /**
     * Get name expiration date.
     *
     * @fires ENS.EVENT_SET_RESPONSE
     * @type {object}
     * @property resultName {string} nameExpires
     *
     * @return Promise<Response>
     */
    public async getExpirationDate(): Promise<IResponseResponseInfo> {
        const EVENT_PROPERTY = 'expirationDateResult';

        try {
            if (!this.Registrar) {
                this.Registrar = new Registrar(this.ethAddress);
                await this.Registrar.init();
            }

            const nameExpires = await this.Registrar.getExpirationDate();
            return this.sendResponse(EVENT_PROPERTY, nameExpires);
        } catch(error) {
            this.sendError(EVENT_PROPERTY, error);
        }
    }

    /**
     * Get address
     *
     * @fires ENS.EVENT_SET_RESPONSE
     * @type {object}
     * @property resultName {string} resolverAddress
     *
     * @return Promise<Response>
     */
    public async getAddress(): Promise<IResponseResponseInfo> {
        const EVENT_PROPERTY = 'addressResult';

        try {
            this.Resolver = new Resolver(this.ethAddress);
            await this.Resolver.init();

            const resolverAddress = await this.Resolver.getAddress();
            return this.sendResponse(EVENT_PROPERTY, resolverAddress);
        } catch(error) {
            this.sendError(EVENT_PROPERTY, error);
        }
    }

    /**
     * Get content hash
     *
     * @fires ENS.EVENT_SET_RESPONSE
     * @type {object}
     * @property resultName {string} resolverContentHash
     *
     * @return Promise<Response>
     */
    public async getContentHash(): Promise<IResponseResponseInfo> {
        const EVENT_PROPERTY = 'contentHashResult';

        try {
            if (!this.Resolver) {
                this.Resolver = new Resolver(this.ethAddress);
                await this.Resolver.init();
            }

            const resolverContentHash = await this.Resolver.getContentHash();
            return this.sendResponse(EVENT_PROPERTY, resolverContentHash);
        } catch(error) {
            this.sendError(EVENT_PROPERTY, error);
        }
    }

    /**
     * Get reverse record, e.g. name from address
     *
     * @fires ENS.EVENT_SET_RESPONSE
     * @type {object}
     * @property resultName {string} revertResolverResult
     *
     * @return Promise<Response>
     */
    public async getReverseRecord(): Promise<IResponseResponseInfo> {
        const EVENT_PROPERTY = 'reverseRecordResult';

        try {
            const address = this.resolveAddress || this.ethAddress;
            this.ReverseResolver = new ReverseResolver(address);
            await this.ReverseResolver.init();

            const revertResolverResult = await this.ReverseResolver.getName();
            return this.sendResponse(EVENT_PROPERTY, revertResolverResult);
        } catch(error) {
            this.sendError(EVENT_PROPERTY, error);
        }
    }

    public async resolve(): Promise<IResponseResponseInfo> {
        if (this.ethAddressType === EthAddressType.name) return this.getAddress();
        if (this.ethAddressType === EthAddressType.address) return this.getReverseRecord();
    }

    private sendResponse(resultName: string, result: IResponseResponseInfo): IResponseResponseInfo {
        result = this.extendResultWithAdditionalInfo(result);

        this.emit(ENS.EVENT_SET_RESPONSE, {
            resultName,
            result
        });

        return result;
    }

    private sendError(resultName: string, result: IResponseResponseInfo) {
        console.error(resultName, result);

        this.sendResponse(resultName, result);

        throw result;
    }

    private extendResultWithAdditionalInfo(result: IResponseResponseInfo): IResponseResponseInfo {
        const outputResult = {
            ...result,
            data: {
                ...result.data,
                address: this.ethAddress,
                addressType: this.ethAddressType
            }
        };

        const nameMain = this.ethAddressType === EthAddressType.name && utils.getNameMain(this.ethAddress);
        const address = result.data && result.data.reverseAddress || outputResult.data.address;
        const addressParent = address && utils.getAddressParent(address);

        if (nameMain) outputResult.data.nameMain = nameMain;
        if (addressParent) outputResult.data.addressParent = addressParent;

        return outputResult;
    }
}
