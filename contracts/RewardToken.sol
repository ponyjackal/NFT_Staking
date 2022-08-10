// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardToken is ERC20 {
    uint256 public constant TOTAL_SUPPLY = 10 ** 8 * 10 ** 18;

    constructor() ERC20("Reward Token", "RWT") {
        _mint(msg.sender, TOTAL_SUPPLY);
    }
}