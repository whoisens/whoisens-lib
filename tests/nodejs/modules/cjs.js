global.expect = require('chai').expect;
global.fetch = require('node-fetch');

const NAME_WHOISENS_ETH = require('whoisens-test-dataset/dataset/whoisens.eth.json');
const NAME_UNICODE = require('whoisens-test-dataset/dataset/unicode-emoji-cat.json');

const WhoisENS = require('../../../dist/cjs/index.js');
global.ENS = WhoisENS.default;

global.ResolveType = WhoisENS.ResolveType;
global.EthAddressType = WhoisENS.EthAddressType;
global.Errors = WhoisENS.Errors;
global.utils = WhoisENS.utils;

const moduleTest = 'Node CommonJS';

require('../../specs/main.js')(moduleTest, NAME_WHOISENS_ETH);
require('../../specs/main.js')(moduleTest, NAME_WHOISENS_ETH, 'https://eth.gateway.whoisens.org');
require('../../specs/main.js')(moduleTest, NAME_WHOISENS_ETH, 'https://eth.gateway.whoisens.org/mainnet/geth/stable');
require('../../specs/main.js')(moduleTest, NAME_WHOISENS_ETH, 'https://eth.gateway.whoisens.org/mainnet/geth/stable', '0x314159265dd8dbb310642f98f50c066173c1259b');
require('../../specs/main.js')(moduleTest, NAME_WHOISENS_ETH, 'https://eth.gateway.whoisens.org/mainnet/geth/unstable');
require('../../specs/main.js')(moduleTest, NAME_WHOISENS_ETH, 'https://eth.gateway.whoisens.org/mainnet/parity');

require('../../specs/main.js')(moduleTest, NAME_UNICODE);
require('../../specs/handle-errors.js')(moduleTest, 'testtesttest.eth');
require('../../specs/handle-errors.js')(moduleTest, 'testtesttest.eth', 'https://eth.gateway.whoisens.org/mainnet/parity');
