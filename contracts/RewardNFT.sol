// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardNFT is ERC721A, Ownable {
    address public nftStakingContract;

    /** EVENTS */
    event StakingContractUpdated(address indexed nftStakingContract);
    event TokenMinted(address indexed to, uint256 amount);

    constructor(address _nftStakingContract) ERC721A("Reward NFT", "RWN") {
        require(_nftStakingContract != address(0), "Invalid address");
        nftStakingContract = _nftStakingContract;
    }

    /** MODIFIERS */
    modifier onlyStakingContract() {
        require(msg.sender == nftStakingContract, "Non staking contract");
        _;
    }

    /** SETTERS */
    function setNFTStakingContract(address _nftStakingContract) external onlyOwner {
        require(_nftStakingContract != address(0), "Invalid address");
        nftStakingContract = _nftStakingContract;

        emit StakingContractUpdated(_nftStakingContract);
    }

    function mintRewards(address _to, uint256 _amount) external onlyStakingContract {
        require(_to != address(0), "Invalid address");

        _mint(_to, _amount);

        emit TokenMinted(_to, _amount);
    }
}
