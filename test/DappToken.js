const DappToken = artifacts.require("DappToken.sol");
const expect = require('chai').expect;

contract('DappToken', (accounts) => {

  it('sets the total supply upon deployment', async () => {
    const tokenInstance = await DappToken.deployed();
    const totalSupply = await tokenInstance.totalSupply();

    expect(totalSupply.toNumber()).to.equal(1000000);
  })
})