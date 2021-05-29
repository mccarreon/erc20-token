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

## Things to change
I noticed the ERC20 standard has changed quite a bit since their video was made. For my own ERC20 token after finishing this tutorial, I've noticed that:
* totalSupply is a private variable in the current ERC20 standard from OpenZeppelin
* Minting is done differently with a function now, rather than creating the supply & sending tokens separately
* I should be extending OpenZeppelin's ERC20