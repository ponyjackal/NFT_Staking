// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardsNFT is ERC721A, Ownable {
    address public nftStakingContract;
    string private _baseTokenURI;

    /** EVENTS */
    event StakingContractUpdated(address indexed nftStakingContract);
    event TokenMinted(address indexed to, uint256 amount);

    constructor(address _nftStakingContract, string memory _baseuri) ERC721A("Rewards NFT", "RWN") {
        nftStakingContract = _nftStakingContract;
        _baseTokenURI = _baseuri;
    }

    /** MODIFIERS */
    modifier onlyStakingContract() {
        require(msg.sender == nftStakingContract, "Non staking contract");
        _;
    }

    /** VIEW FUNCTIONS */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /** SETTERS */
    function setNFTStakingContract(address _nftStakingContract) external onlyOwner {
        require(_nftStakingContract != address(0), "Invalid address");
        nftStakingContract = _nftStakingContract;

        emit StakingContractUpdated(_nftStakingContract);
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /** MUTATIVE FUNCTIONS */

    function mintRewards(address _to, uint256 _amount) external onlyStakingContract {
        require(_to != address(0), "Invalid address");

        _mint(_to, _amount);

        emit TokenMinted(_to, _amount);
    }
}
