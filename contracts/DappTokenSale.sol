// SPDX-License-Identifier: MIT
pragma solidity >=0.4.2;

import "./DappToken.sol";

contract DappTokenSale {
    address admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;
    
    event Sell(
        address indexed _buyer,
        uint256 _amount
    );

    constructor(DappToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    // multiply
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(tokenPrice, _numberOfTokens));
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        
        // keep track of tokensSold
        tokensSold += _numberOfTokens;

        // trigger sell event
        emit Sell(msg.sender, _numberOfTokens);
    }
}