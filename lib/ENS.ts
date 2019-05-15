import EventEmitter from 'events';

import config from '../config.json';

import ENSRoot from './ENSRoot.js';
import Registrar from './Registrar.js';
import Resolver from './Resolver.js';
import ReverseResolver from './ReverseResolver.js';
import utils from '../utils/index.js';

export enum EthNameType {
    name = 'name',
    address = 'address',
    error = 'error'
}

export interface SetResponse {
    resultName: string,
    result: Response
}

export interface SetResponseError {
    resultName: string,
    error: string
}

export interface Response {
    contractAddress: string,
    contractMethod: string,
    result: string,
    data?: object,
    error?: string
}

export default class ENS extends EventEmitter {
    public currentNetwork: string;

    private ENSRoot: ENSRoot;
    private Registrar: Registrar;
    private Resolver: Resolver;
    private ReverseResolver: ReverseResolver;

    public ethName: string | undefined;
    public ethNameType: EthNameType | undefined;
    public resolveAddress: string | undefined;

    /**
     * @event
     */
    static EVENT_ETH_NAME = 'ethName';

    /**
     * @event
     */
    static EVENT_ETH_NAME_TYPE = 'ethNameType';

    /**
     * @event
     */
    static EVENT_SET_RESPONSE = 'setResponse';

    constructor(networkName: string = config.defaultNetworkName) {
        super();
        this.currentNetwork = networkName;

        this.ENSRoot = new ENSRoot(this.currentNetwork);
    }

    /**
     * Init with eth name.
     *
     * @fires ENS.EVENT_ETH_NAME
     * @fires ENS.EVENT_ETH_NAME_TYPE
     */
    public init(ethName: string): void {
        this.ethName = ethName;

        this.emit(ENS.EVENT_ETH_NAME, this.ethName);

        this.ethNameType = utils.getNameType(this.ethName);
        if (this.ethName.endsWith('.addr.reverse')) this.ethName = utils.reverseAddressToHex(this.ethName);

        this.emit(ENS.EVENT_ETH_NAME_TYPE, this.ethNameType);
    }

    public async getInfo() {
        if (!this.ethName || !this.ethNameType) throw 'Please call init before';

        let nameOwnerResult;
        let registrarOwnerResult;
        let resolverAddress;

        if (this.ethNameType === EthNameType.error) return;

        if (this.ethNameType === EthNameType.name) {
            nameOwnerResult = await this.getNameOwner();
            if (nameOwnerResult.result === '0x') return;

            registrarOwnerResult = await this.getRegistrarOwner();
            if (!registrarOwnerResult.result) return;

            await this.getRegistrarExpired();
            resolverAddress = await this.getResolverAddress();
            await this.getContentHash();

            if (!resolverAddress.result) {
                return this.sendResponse('revertResolverResult', {
                    contractAddress: '0x',
                    contractMethod: undefined,
                    result: undefined,
                    data: {
                        reverseAddress: undefined
                    }
                });
            }

            this.resolveAddress = resolverAddress.result;
        }

        await this.getRevertResolver();
    }

    /**
     * Get Eth Name owner.
     *
     * @fires ENS.EVENT_SET_RESPONSE
     * @type {object}
     * @property resultName {string} nameOwnerResult
     *
     * @return Promise<Response>
     */
    public async getNameOwner(): Promise<Response> {
        try {
            const nameOwnerResult = await this.ENSRoot.getOwner(this.ethName);

            this.sendResponse('nameOwnerResult', nameOwnerResult);

            return nameOwnerResult;
        } catch(error) {
            this.sendError('nameOwnerResult', error);
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
    public async getRegistrarOwner(): Promise<Response> {
        try {
            this.Registrar = new Registrar(this.currentNetwork, this.ethName);
            await this.Registrar.init();

            const registrarOwnerResult = await this.Registrar.getOwner();
            this.sendResponse('registrarOwnerResult', registrarOwnerResult);

            return registrarOwnerResult;
        } catch(error) {
            this.sendError('registrarOwnerResult', error);
        }
    }

    /**
     * Get Registrar expired.
     *
     * @fires ENS.EVENT_SET_RESPONSE
     * @type {object}
     * @property resultName {string} registrarExpired
     *
     * @return Promise<Response>
     */
    public async getRegistrarExpired(): Promise<Response> {
        try {
            if (!this.Registrar) {
                this.Registrar = new Registrar(this.currentNetwork, this.ethName);
                await this.Registrar.init();
            }

            const registrarExpired = await this.Registrar.getExpired();
            this.sendResponse('registrarExpired', registrarExpired);

            return registrarExpired;
        } catch(error) {
            this.sendError('registrarExpired', error);
        }
    }

    /**
     * Get Forward Resolver address
     *
     * @fires ENS.EVENT_SET_RESPONSE
     * @type {object}
     * @property resultName {string} resolverAddress
     *
     * @return Promise<Response>
     */
    public async getResolverAddress(): Promise<Response> {
        try {
            this.Resolver = new Resolver(this.currentNetwork, this.ethName);
            await this.Resolver.init();

            const resolverAddress = await this.Resolver.getAddress();
            this.sendResponse('resolverAddress', resolverAddress);

            return resolverAddress;
        } catch(error) {
            this.sendError('resolverAddress', error);
        }
    }

    /**
     * Get Content hash
     *
     * @fires ENS.EVENT_SET_RESPONSE
     * @type {object}
     * @property resultName {string} resolverContentHash
     *
     * @return Promise<Response>
     */
    public async getContentHash(): Promise<Response> {
        try {
            if (!this.Resolver) {
                this.Resolver = new Resolver(this.currentNetwork, this.ethName);
                await this.Resolver.init();
            }

            const resolverContentHash = await this.Resolver.getContentHash();
            this.sendResponse('resolverContentHash', resolverContentHash);

            return resolverContentHash;
        } catch(error) {
            this.sendError('resolverContentHash', error);
        }
    }

    /**
     * Get Reve hash
     *
     * @fires ENS.EVENT_SET_RESPONSE
     * @type {object}
     * @property resultName {string} revertResolverResult
     *
     * @return Promise<Response>
     */
    public async getRevertResolver(): Promise<Response> {
        try {
            const address = this.resolveAddress || this.ethName;
            this.ReverseResolver = new ReverseResolver(this.currentNetwork, address);
            await this.ReverseResolver.init();

            const revertResolverResult = await this.ReverseResolver.getName();
            this.sendResponse('revertResolverResult', revertResolverResult);

            return revertResolverResult;
        } catch(error) {
            this.sendError('revertResolverResult', error);
        }
    }

    private sendResponse(resultName: string, result: object) {
        this.emit(ENS.EVENT_SET_RESPONSE, {
            resultName,
            result
        });
    }

    private sendError(resultName: string, result: object) {
        console.error(resultName, result);

        this.sendResponse(resultName, result);

        throw result;
    }
}
