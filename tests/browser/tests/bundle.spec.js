import {expect} from 'chai';

import NAME_WHOISENS_ETH from 'whoisens-test-dataset/dataset/whoisens.eth.json';

const ENS = WhoisENS.default;

const networkName = 'mainnet';
const networkURL = 'https://eth.gateway.whoisens.org';

describe('Browser bundle', () => {
  const ethName = NAME_WHOISENS_ETH.eth_names[0];
  const name = ethName.name;

  const ens = new ENS(networkName, networkURL);

  it(`get Eth Name owner for: ${name}`, async () => {
    ens.init(name);
    const result = await ens.getOwner();

    expect(result.error).to.be.undefined;
    expect(result.result).to.equal(NAME_WHOISENS_ETH.owner);
  });

  it(`get Eth Name expiration date for: ${name}`, async () => {
    ens.init(name);
    const result = await ens.getExpirationDate();

    expect(result.error).to.be.undefined;
    expect(result.result, NAME_WHOISENS_ETH.expires);
  });

  it(`get Controller for: ${name}`, async () => {
    ens.init(name);
    const result = await ens.getController();

    expect(result.error).to.be.undefined;
    expect(result.result).to.equal(ethName.controller);
  });

  it(`get Resolve address for: ${name}`, async () => {
    ens.init(name);
    const result = await ens.resolve();
    expect(result.result).to.equal(ethName.resolved_address);
  });

  let resolvedAddress = ethName.resolved_address;
  it(`get Reverse address for: ${resolvedAddress}`, async () => {
    ens.init(resolvedAddress);
    const result = await ens.resolve();

    expect(result.error).to.be.undefined;
    expect(result.result).to.equal(ethName.reverse_resolved_address);
  });

  it(`get content hash for: ${name}`, async () => {
    ens.init(name);
    const result = await ens.getContentHash();

    expect(result.error).to.be.undefined;
    expect(result.result).to.equal(ethName.resolved_content);
  });
});


