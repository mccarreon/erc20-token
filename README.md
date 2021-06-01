# ERC20 Dapp University Token

## Goal
* Learn structure & implementation of ERC20 token standard for Ethereum

In order to do this, I am following Dapp University's ERC20 tutorial. Their video is a little outdated now (2018) so there are some differences. 

## Differences
* Accessing accounts in truffle console is now:
    + `web3.eth.getAccounts()`
* Constructors must now be made like:
    + `constructor(...) public {}`


## Improvements
In their video, Dapp University uses promise chains with the `.then()` method. I'm not a huge fan of this syntax, as it results in a lot of chained callbacks that can look unappealing. I changed the truffle tests to use async/await for cleaner code. 

Ran into issues with testing revert exceptions. At first, I tried using try, catch blocks to catch exceptions. However, I realized tests were passing when they shouldn't have (ex: transferring more than the balance of an account passing with AND without the require statement). This was due to the test not reaching the catch when there is no error, and I needed something to expect a rejection if it skips the error catching. I installed chai-as-promised to fix this, and had to await the expected rejection. This causes the test to fail on a successful transaction, when there shouldn't have been one.

## Things to change
I noticed the ERC20 standard has changed quite a bit since their video was made. For my own ERC20 token after finishing this tutorial, I've noticed that:
* totalSupply is a private variable in the current ERC20 standard from OpenZeppelin
* Minting is done differently with a function now, rather than creating the supply & sending tokens separately
* I should be extending OpenZeppelin's ERC20