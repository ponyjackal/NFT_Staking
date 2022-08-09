// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTStaking is Ownable {
    using Address for address;

    IERC20 public rewardToken;
    IERC721 public rewardNFT;

    constructor(address _rewardToken, address _rewardNFT) {
        require(_rewardToken != address(0), "Invalid reward token");
        require(_rewardNFT != address(0), "Invalid reward NFT");
        require(IERC165(_rewardNFT).supportsInterface(0x80ac58cd), "Non-erc721");

        rewardToken = IERC20(_rewardToken);
        rewardNFT = IERC721(rewardNFT);
    }
}