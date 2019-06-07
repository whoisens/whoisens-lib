module.exports = (moduleTest, NAMES, networkURL, contractAddress) => {
  describe(`${moduleTest}: ${NAMES.main_name} - ${networkURL} - ${contractAddress}`, () => {
    for (const ethName of NAMES.eth_names) {
      const name = ethName.name;

      it(`get Eth Name owner for: ${name}`, async () => {
        const ens = new ENS({networkURL, contractAddress});
        ens.init(name);
        const result = await ens.getOwner();

        expect(result.error).to.be.undefined;

        expect(result.data.nameMain).to.equal(NAMES.main_name);
        expect(result.data.address).to.equal(name);
        expect(result.data.addressParent).to.equal(ethName.parent);
        expect(result.result).to.equal(NAMES.owner);
      });

      it(`get Eth Name expiration date for: ${name}`, async () => {
        const ens = new ENS({networkURL, contractAddress});
        ens.init(name);
        const result = await ens.getExpirationDate();

        expect(result.error).to.be.undefined;

        expect(result.result).to.equal(NAMES.expires);
      });

      it(`get Controller for: ${name}`, async () => {
        const ens = new ENS({networkURL, contractAddress});
        ens.init(name);
        const result = await ens.getController();

        expect(result.error).to.be.undefined;

        expect(result.result).to.equal(ethName.controller);
      });

      it(`get Resolve address for: ${name}`, async () => {
        const ens = new ENS({networkURL, contractAddress});
        ens.init(name);

        expect(ens.getEthAddressType()).to.equal(EthAddressType.name);

        if (!ethName.forward_resolver) {
          try {
            await ens.resolve();
            throw 'It shouldn\'t be at this point';
          } catch(error) {
            expect(error.constructor).to.equal(Errors.ResolverNotSetError);
            expect(error.message).to.equal('Resolver is not set');
            expect(error.toString()).to.equal('ResolverNotSetError: Resolver is not set');
          }
        } else {
          const result = await ens.resolve();
          expect(result.error).to.be.undefined;
          expect(result.data.resolveType).to.equal(ResolveType.forward);

          if (utils.isResult(result.result) || utils.isResult(ethName.resolved_address)) {
            expect(result.result).to.equal(ethName.resolved_address);
          }
        }
      });

      let resolvedAddress = ethName.resolved_address;
      const reverseResolvedAddress = ethName.reverse_resolved_address;

      if (resolvedAddress && reverseResolvedAddress) {
        it(`get Reverse address for: ${resolvedAddress}`, async () => {
          const ens = new ENS({networkURL, contractAddress});
          ens.init(resolvedAddress);
          const result = await ens.resolve();

          expect(result.error).to.be.undefined;

          expect(result.data.addressType).to.equal(EthAddressType.address);
          expect(result.data.resolveType).to.equal(ResolveType.reverse);
          expect(result.data.reverseAddress).to.equal(resolvedAddress.slice(2) + '.addr.reverse');
          expect(result.data.addressParent).to.equal('addr.reverse');

          if (reverseResolvedAddress) {
            expect(result.result).to.equal(reverseResolvedAddress);
          }
        });

        const resolvedAddress2 = resolvedAddress.slice(2) + '.addr.reverse';
        it(`get Reverse address for: ${resolvedAddress2}`, async () => {
          const ens = new ENS({networkURL, contractAddress});
          ens.init(resolvedAddress2);
          const result = await ens.resolve();

          expect(result.error).to.be.undefined;

          expect(result.data.addressType).to.equal(EthAddressType.address);
          expect(result.data.resolveType).to.equal(ResolveType.reverse);
          expect(result.data.reverseAddress).to.equal(resolvedAddress2);
          expect(result.data.addressParent).to.equal('addr.reverse');

          if (reverseResolvedAddress) {
            expect(result.result).to.equal(reverseResolvedAddress);
          }
        });
      }

      if (utils.isResult(ethName.resolved_address)) {
        it(`get content hash for: ${name}`, async () => {
          const ens = new ENS({networkURL, contractAddress});
          ens.init(name);

          const result = await ens.getContentHash();

          expect(result.error).to.be.undefined;

          expect(result.result).to.equal(ethName.resolved_content);
        });
      }
    }
  });
};
