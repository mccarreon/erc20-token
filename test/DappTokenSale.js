const DappTokenSale = artifacts.require("DappTokenSale.sol");
const DappToken = artifacts.require("DappToken.sol");

const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const expect = chai.expect;

contract('DappTokenSale', (accounts) => {
  let [admin, buyer] = accounts;
  let tokenSaleInstance;
  let tokenInstance;
  const tokenPrice = 1000000000000000; // token price in wei, equal to 0.001 ETH
  const tokensAvailable = 750000;

  beforeEach(async () => {
    tokenInstance = await DappToken.new(1000000);
    tokenSaleInstance = await DappTokenSale.new(tokenInstance.address, tokenPrice);
    tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, { from: admin });
  })

  context('with intialization of contract', async () => {
    it('has contract address', async () => {
      const address = await tokenSaleInstance.address;
      expect(address).to.not.equal(0x0, 'expected address to not be 0x0');
    })
    it('has token sale contract address', async () => {
      const address = await tokenSaleInstance.tokenContract();
      expect(address).to.not.equal(0x0, 'expected token address to not be 0x0')
    })
    it('sets token price correctly', async () => {
      const price = await tokenSaleInstance.tokenPrice();
      expect(price.toNumber()).to.equal(tokenPrice, 'expected contract token price to equal tokenPrice');
    })
  })

  context('with buying tokens', async () => {
    it('sells correct number of tokens', async () => {
      const numberOfTokens = 10;
      const value = numberOfTokens * tokenPrice;

      tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: value });
      const amountSold = await tokenSaleInstance.tokensSold();

      expect(amountSold.toNumber()).to.equal(numberOfTokens, 'expected number of tokens sold to be 10');
    })
    it('triggers sell event', async () => {
      const numberOfTokens = 10;
      const value = numberOfTokens * tokenPrice;

      const receipt = await tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: value })

      expect(receipt.logs.length).to.equal(1, 'expected one triggered event');
      expect(receipt.logs[0].event).to.equal('Sell', 'expected event to be an Sell');
      expect(receipt.logs[0].args._buyer).to.equal(buyer, 'expected _buyer address to be buyer');
      expect(receipt.logs[0].args._amount.toNumber()).to.equal(numberOfTokens, 'expected _amount to equal numberOfTokens');
    })
    it('correct amount of eth is used for purchase', async () => {
      await expect(tokenSaleInstance.buyTokens(10, {from: buyer, value: 1})).to.be.rejectedWith('revert');
    })
    it('contract has enough tokens to sell', async () => {
      const numberOfTokens = 800000;
      const value = numberOfTokens * tokenPrice;

      await expect(tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: value})).to.be.rejectedWith('revert');
    })
    it('tokens are transferred correctly', async () => {
      let contractBalance;
      let buyerBalance;
      const numberOfTokens = 10;
      const value = numberOfTokens * tokenPrice;
      
      tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: value });
      contractBalance = await tokenInstance.balanceOf(tokenSaleInstance.address);
      buyerBalance = await tokenInstance.balanceOf(buyer);

      expect(contractBalance.toNumber()).to.equal(tokensAvailable - numberOfTokens, 'expected balance of address to be tokensAvailable-numberOfTokens (750000-10)');
      expect(buyerBalance.toNumber()).to.equal(numberOfTokens, 'expected buyer to have 10 tokens');
    })
  })

  context('with ending token sale', async () => {
    it('fails to end sale from non-admin account', async () => {
      await expect(tokenSaleInstance.endSale({ from: buyer })).to.be.rejectedWith('revert');
    })
    it('admin can end sale', async () => {
      const receipt = await tokenSaleInstance.endSale({ from: admin });
      expect(receipt).to.exist;
    })
    it('returns unsold tokens to admin', async () => {
      const numberOfTokens = 10;
      const value = numberOfTokens * tokenPrice;
      tokenSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: value });
      tokenSaleInstance.endSale({ from: admin });

      const adminBalance = await tokenInstance.balanceOf(admin);
      
      expect(adminBalance.toNumber()).to.equal(999990, 'expected initial 1,000,000 - 10 coins');
    })
    it('ensures contract is no longer functional', async () => {
      tokenSaleInstance.endSale({ from: admin });

      await expect(tokenSaleInstance.tokenPrice()).to.eventually.be.rejected;
    })
  })
})