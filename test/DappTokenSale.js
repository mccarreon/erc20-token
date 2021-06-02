const DappTokenSale = artifacts.require("DappTokenSale.sol");
const DappToken = artifacts.require("DappToken.sol");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

contract('DappTokenSale', (accounts) => {
  let contractInstance;
  // token price in wei, equal to 0.001 ETH
  const tokenPrice = 1000000000000000;
  
  beforeEach(async () => {
    const tokenInstance = await DappToken.new(1000000);
    contractInstance = await DappTokenSale.new(tokenInstance.address, tokenPrice);
  })

  context('with intialization of contract', async () => {
    it('has contract address', async () => {
      const address = await contractInstance.address;
      expect(address).to.not.equal(0x0, 'expected address to not be 0x0');
    })
    it('has token sale contract address', async () => {
      const address = await contractInstance.tokenContract();
      expect(address).to.not.equal(0x0, 'expected token address to not be 0x0')
    })
    it('sets token price correctly', async () => {
      const price = await contractInstance.tokenPrice();
      expect(price.toNumber()).to.equal(tokenPrice, 'expected contract token price to equal tokenPrice');
    })
  })
})