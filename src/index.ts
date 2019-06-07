import config from './config.js';

import {
    EthAddressType, ISetResponse, ISetResponseError, IResponse, ResolveType,
    ResolverNotSetError, InvalidEthNameError, NameIsNotRegisteredError
} from './lib/types.js';

import ContractNames from './lib/ContractNames.js';
import ENS from './lib/ENS.js';
import utils from './utils/index.js';

const Errors = {
    ResolverNotSetError,
    InvalidEthNameError,
    NameIsNotRegisteredError
};

export {
    ResolveType,
    ISetResponse,
    ISetResponseError,
    IResponse,
    ContractNames,
    EthAddressType,
    utils,
    config,
    Errors
};

export default ENS;
