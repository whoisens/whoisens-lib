import {createRequire} from 'module';
import {fileURLToPath as fromURL} from 'url';

const require = createRequire(fromURL(import.meta.url));

import Suite from 'node-test';
import fetch from 'node-fetch';
import NAME_WHOISENS_ETH from 'whoisens-test-dataset/dataset/whoisens.eth.json';
import ENS, {ResolveType, EthAddressType, utils} from '../../dist/esm/index.js';

global.Suite = Suite;
global.fetch = fetch;
global.NAME_WHOISENS_ETH = NAME_WHOISENS_ETH;

global.ENS = ENS;
global.ResolveType = ResolveType;
global.EthAddressType = EthAddressType;
global.utils = utils;

global.NAME_MAIN = NAME_WHOISENS_ETH.main_name;
global.OWNER = NAME_WHOISENS_ETH.owner;
global.EXPIRES = NAME_WHOISENS_ETH.expires;

global.networkName = 'mainnet';
global.networkURL = 'https://eth.gateway.whoisens.org';

require('./common-test.js');
