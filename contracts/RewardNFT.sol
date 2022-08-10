// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RewardNFT is ERC721 {
    constructor() ERC721("Reward NFT", "RWN") {
        for (uint256 i = 0; i < 10; i++) {
            _mint(msg.sender, i);
        }
    }
}