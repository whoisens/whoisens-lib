import Suite from 'node-test';
import fetch from 'node-fetch';
import NAME_WHOISENS_ETH from './names/whoisens.eth.js';

global.fetch = fetch;

import ENS, {ResolveType, EthAddressType, utils} from '../dist/esm/index.js';

const NAME_MAIN = NAME_WHOISENS_ETH.main_name;
const OWNER = NAME_WHOISENS_ETH.owner;
const EXPIRES = NAME_WHOISENS_ETH.expires;

const suite = new Suite('ENS');

(async () => {
  for (const ethName of NAME_WHOISENS_ETH.eth_names) {
    const name = ethName.name;

    suite.test(`get Eth Name owner for: ${name}`, async (t) => {
      const ens = new ENS();
      await ens.init(name);
      const result = await ens.getOwner();

      t.equal(result.data.nameMain, NAME_MAIN);
      t.equal(result.data.address, name);
      t.equal(result.data.addressParent, ethName.parent);

      t.equal(result.result, OWNER);
    });

    suite.test(`get Eth Name expiration date for: ${name}`, async (t) => {
      const ens = new ENS();
      await ens.init(name);
      const result = await ens.getExpirationDate();

      t.equal(result.result, EXPIRES);
    });


    suite.test(`get Controller for: ${name}`, async (t) => {
      const ens = new ENS();
      await ens.init(name);
      const result = await ens.getController();

      t.equal(result.result, ethName.controller);
    });


    suite.test(`get Resolve address for: ${name}`, async (t) => {
      const ens = new ENS();
      await ens.init(name);
      const result = await ens.resolve();

      t.equal(EthAddressType.name, ens.getEthAddressType());
      t.equal(result.data.resolveType, ResolveType.forward);

      if (utils.isResult(result.result) || utils.isResult(ethName.resolved_address)) {
        t.equal(result.result, ethName.resolved_address);
      }
    });

    let resolvedAddress = ethName.resolved_address;
    const reverseResolvedAddress = ethName.reverse_resolved_address;

    if (resolvedAddress && reverseResolvedAddress) {
      suite.test(`get Reverse address for: ${resolvedAddress}`, async (t) => {
        const ens = new ENS();
        await ens.init(resolvedAddress);
        const result = await ens.resolve();

        t.equal(EthAddressType.address, ens.getEthAddressType());
        t.equal(result.data.resolveType, ResolveType.reverse);
        t.equal(result.data.reverseAddress, resolvedAddress.slice(2) + '.addr.reverse');
        t.equal(result.data.addressParent, 'addr.reverse');

        if (reverseResolvedAddress) {
          t.equal(result.result, reverseResolvedAddress);
        }
      });

      const resolvedAddress2 = resolvedAddress.slice(2) + '.addr.reverse';
      suite.test(`get Reverse address for: ${resolvedAddress2}`, async (t) => {
        const ens = new ENS();
        await ens.init(resolvedAddress2);
        const result = await ens.resolve();

        t.equal(EthAddressType.address, ens.getEthAddressType());
        t.equal(result.data.resolveType, ResolveType.reverse);
        t.equal(result.data.reverseAddress, resolvedAddress2);
        t.equal(result.data.addressParent, 'addr.reverse');

        if (reverseResolvedAddress) {
          t.equal(result.result, reverseResolvedAddress);
        }
      });
    }

    if (utils.isResult(ethName.resolved_address)) {
      suite.test(`get content hash for: ${name}`, async (t) => {
        const ens = new ENS();
        await ens.init(name);

        const result = await ens.getContentHash();

        t.equal(result.result, ethName.resolved_content);
      });
    }
  }
})();


