import config from './config.js';

import {EthAddressType, ISetResponse, ISetResponseError, IResponse, ResolveType} from './lib/types.js';
import ContractNames from './lib/ContractNames.js';
import ENS from './lib/ENS.js';
import utils from './utils/index.js';

export {
    ResolveType,
    ISetResponse,
    ISetResponseError,
    IResponse,
    ContractNames,
    EthAddressType,
    utils,
    config
};

export default ENS;
