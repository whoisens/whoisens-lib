import {expect} from 'chai';
import NAME_WHOISENS_ETH from 'whoisens-test-dataset/dataset/whoisens.eth.json';
import NAME_UNICODE from 'whoisens-test-dataset/dataset/unicode-emoji-cat.json';
import ENS, {ResolveType, EthAddressType, utils, Errors} from '../../../dist/esm/index.js';

window.expect = expect;

window.ENS = ENS;
window.ResolveType = ResolveType;
window.EthAddressType = EthAddressType;
window.Errors = Errors;
window.utils = utils;

const moduleTest = 'Browser ESM';

require('../../specs/main.js')(moduleTest, NAME_WHOISENS_ETH);
require('../../specs/main.js')(moduleTest, NAME_WHOISENS_ETH, 'https://eth.gateway.whoisens.org');
require('../../specs/main.js')(moduleTest, NAME_WHOISENS_ETH, 'https://eth.gateway.whoisens.org/mainnet/geth/stable');
require('../../specs/main.js')(moduleTest, NAME_WHOISENS_ETH, 'https://eth.gateway.whoisens.org/mainnet/geth/stable', '0x314159265dd8dbb310642f98f50c066173c1259b');
require('../../specs/main.js')(moduleTest, NAME_WHOISENS_ETH, 'https://eth.gateway.whoisens.org/mainnet/geth/unstable');
require('../../specs/main.js')(moduleTest, NAME_WHOISENS_ETH, 'https://eth.gateway.whoisens.org/mainnet/parity');

require('../../specs/main.js')(moduleTest, NAME_UNICODE);
require('../../specs/handle-errors.js')(moduleTest, 'testtesttest.eth');
require('../../specs/handle-errors.js')(moduleTest, 'testtesttest.eth', 'https://eth.gateway.whoisens.org/mainnet/parity');
