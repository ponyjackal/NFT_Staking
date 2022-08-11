// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardsToken is ERC20, Ownable {
    uint256 public constant TOTAL_SUPPLY = 10**8 * 10**18;

    address public nftStakingContract;

    /** EVENTS */
    event StakingContractUpdated(address indexed nftStakingContract);
    event TokenMinted(address indexed to, uint256 amount);

    constructor(address _nftStakingContract) ERC20("Reward Token", "RWT") {
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

    function mint(address _to, uint256 _amount) external onlyStakingContract {
        require(_to != address(0), "Invalid address");

        _mint(_to, _amount);

        emit TokenMinted(_to, _amount);
    }
}
