const DappToken = artifacts.require("DappToken.sol");
const expect = require('chai').expect;

contract('DappToken', (accounts) => {
  let [alice, bob] = accounts;
  let contractInstance;

  beforeEach(async () => {
    contractInstance = await DappToken.new(1000000);
  });

  context('with initial deployment of contract', async () => {
    it('sets total supply', async () => {
      const totalSupply = await contractInstance.totalSupply();
      expect(totalSupply.toNumber()).to.equal(1000000, 'expected total supply to be 1,000,000');
    });
    it('allocates total supply', async () => {
      const adminBalance = await contractInstance.balanceOf(alice);
      expect(adminBalance.toNumber()).to.equal(1000000, 'expected alice address to have 1,000,000 tokens');
    });
    it('sets correct name and symbol', async () => {
      expect(await contractInstance.name()).to.equal('Dapp Token', 'expected name to be Dapp Token');
      expect(await contractInstance.symbol()).to.equal('DAPP', 'expected token symbol to be DAPP');
      expect(await contractInstance.standard()).to.equal('Dapp Token v1.0', 'expected version v1.0');
    });
  });
});