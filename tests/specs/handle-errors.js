module.exports = (moduleTest, name, networkURL, contractAddress) => {
  describe(`${moduleTest}: ${name} - ${networkURL} - ${contractAddress}`, () => {
    it('should return resultError for non-existed name', async () => {
      const ens = new ENS();
      ens.init(name);
      const result = await ens.getOwner();

      expect(result.error).to.be.undefined;
      expect('resultError' in result, 'resultError should be presented').to.be.true;

      expect(result.resultError.name).to.equal('NameIsNotRegisteredError');
      expect(result.resultError.message).to.equal('Name is not registered');
      expect(result.resultError.code).to.equal('NAME_IS_NOT_REGISTERED');
      expect(result.resultError.toString()).to.equal('NameIsNotRegisteredError: Name is not registered');
      expect(result.resultError.constructor).to.equal(Errors.NameIsNotRegisteredError);
      expect(result.result).to.equal('0x');
    });

    it('should return resultError for non-existed name', async () => {
      const ens = new ENS();
      ens.init(name);
      const result = await ens.getExpirationDate();

      expect(result.error).to.be.undefined;
      expect('resultError' in result, 'resultError should be presented').to.be.true;

      expect(result.resultError.name).to.equal('NameIsNotRegisteredError');
      expect(result.resultError.message).to.equal('Name is not registered');
      expect(result.resultError.code).to.equal('NAME_IS_NOT_REGISTERED');
      expect(result.resultError.toString()).to.equal('NameIsNotRegisteredError: Name is not registered');
      expect(result.resultError.constructor).to.equal(Errors.NameIsNotRegisteredError);
      expect(result.result).to.equal(0);
    });

    it('check for Controller', async () => {
      const ens = new ENS();
      ens.init(name);
      const result = await ens.getController();

      expect(result.error).to.be.undefined;

      expect(result.result).to.equal('0x');
    });

    it(`try to resolve a name. Should throw an error, as name doesn't exist`, async () => {
      const ens = new ENS();
      ens.init(name);

      try {
        await ens.resolve();
        throw Error('Should not be at that point');
      } catch(error) {
        expect(error.constructor).to.equal(Errors.NameIsNotRegisteredError);
        expect(error.name).to.equal('NameIsNotRegisteredError');
        expect(error.code).to.equal('NAME_IS_NOT_REGISTERED');
        expect(error.message).to.equal('Name is not registered');
      }
    });

    it(`try to resolve 0x0 address. Should throw an error, as address is invalid`, async () => {
      const ens = new ENS();
      try {
        ens.init('0x0000000000000000000000000000000000000000');
        throw Error('Should not be at that point');
      } catch(error) {
        expect(error.constructor).to.equal(Errors.InvalidEthNameError);
        expect(error.name).to.equal('InvalidEthNameError');
        expect(error.code).to.equal('INVALID_ETH_NAME');
        expect(error.message).to.equal('Invalid address or name. Got: 0x0000000000000000000000000000000000000000');
      }
    });

    it(`try to resolve 0x1111 address. Should throw an error as address is invalid`, async () => {
      const ens = new ENS();
      try {
        ens.init('0x1111');
        throw Error('Should not be at that point');
      } catch(error) {
        expect(error.constructor).to.equal(Errors.InvalidEthNameError);
        expect(error.name).to.equal('InvalidEthNameError');
        expect(error.code).to.equal('INVALID_ETH_NAME');
        expect(error.message).to.equal('Invalid address or name. Got: 0x1111');
      }
    });

    it(`try to resolve 0x2222222222222222222222222222222222222222 address. Should throw an error as resolver is not set`, async () => {
      const ens = new ENS();
      ens.init('0x2222222222222222222222222222222222222222');

      try {
        await ens.resolve();
        throw Error('Should not be at that point');
      } catch(error) {
        expect(error.constructor).to.equal(Errors.ResolverNotSetError);
        expect(error.name).to.equal('ResolverNotSetError');
        expect(error.code).to.equal('RESOLVER_NOT_SET');
        expect(error.message).to.equal('Resolver is not set');
      }
    });
  })
};
