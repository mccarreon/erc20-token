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

  context('with attempting transfer of tokens', async () => {
    it('reverts insufficient balance', async () => {
      try {
        await contractInstance.transfer.call(bob, 99999999);
      } catch (error) {
        expect(error.message.indexOf('revert')).to.be.at.least(0);
      }
    })
    it('returns true on successful call', async () => {
      expect(await contractInstance.transfer.call(bob, 250000)).to.be.true;
    })
    it('successfully transfers tokens', async () => {
      const receipt = await contractInstance.transfer(bob, 250000, { from: alice });
      const receivedBalance = await contractInstance.balanceOf(bob);
      const remainingSupply = await contractInstance.balanceOf(alice);
      
      expect(receipt.logs.length).to.equal(1, 'expected one triggered event');
      expect(receipt.logs[0].event).to.equal('Transfer', 'expected event to be a Transfer');
      expect(receipt.logs[0].args._from).to.equal(alice, 'expected _from address to be alice');
      expect(receipt.logs[0].args._to).to.equal(bob, 'expected receiving address to be bob');
      expect(receipt.logs[0].args._value.toNumber()).to.equal(250000, 'expected transfer value to be 250,000');
      expect(receivedBalance.toNumber()).to.equal(250000, 'expected received balance to be 250,000');
      expect(remainingSupply.toNumber()).to.equal(750000, 'expected remaining supply to be 1,000,000 - 250,000');
    })
  })

  context('with attempting delegated transfer of tokens', async () => {
    it('returns true on successful approve call', async () => {
      expect(await contractInstance.approve.call(bob, 100)).to.be.true;
    })
    it('approves an address for transfer', async () => {
      const receipt = await contractInstance.approve(bob, 100, { from: alice });

      expect(receipt.logs.length).to.equal(1, 'expected one triggered event');
      expect(receipt.logs[0].event).to.equal('Approval', 'expected event to be an Approval');
      expect(receipt.logs[0].args._owner).to.equal(alice, 'expected _owner address to be alice');
      expect(receipt.logs[0].args._spender).to.equal(bob, 'expected _spender to be bob');
      expect(receipt.logs[0].args._value.toNumber()).to.equal(100, 'expected approval value to be 100');
    })
    it('reads allowance for bob\'s address for a delegated transfer from alice', async () => {
      await contractInstance.approve(bob, 100, { from: alice });
      const allowance = await contractInstance.allowance(alice, bob);
      expect(allowance.toNumber()).to.equal(100, 'expected allowance for bob to be 100');
    })
  })
});