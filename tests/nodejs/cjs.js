global.Suite = require('node-test');
global.fetch = require('node-fetch');
global.NAME_WHOISENS_ETH = require('whoisens-test-dataset/dataset/whoisens.eth.json');

const WhoisENS = require('../../dist/cjs/index.js');
global.ENS = WhoisENS.default;

global.ResolveType = WhoisENS.ResolveType;
global.EthAddressType = WhoisENS.EthAddressType;
global.utils = WhoisENS.utils;

global.NAME_MAIN = NAME_WHOISENS_ETH.main_name;
global.OWNER = NAME_WHOISENS_ETH.owner;
global.EXPIRES = NAME_WHOISENS_ETH.expires;

global.networkName = 'mainnet';
global.networkURL = 'https://eth.gateway.whoisens.org';

require('./common-test.js');
