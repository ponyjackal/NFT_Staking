// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTStaking is Ownable {
    using Address for address;

    IERC20 public immutable rewardToken;
    IERC721 public immutable stakeNFT;
    IERC721 public immutable rewardNFT;

    uint256 public constant WAVE = 30 days;
    uint256 public lockPeriod;
    uint256 public rewardAmount;
    uint256 public apyAmount;

    struct LockInfo {
        address owner;
        uint256 lockedTime;
        uint256 tokenId;
        uint256 claimedRewards;
        bool isUnlocked;
    }

    mapping(uint256 => LockInfo) internal lockInfo;
    address internal vaultWallet;

    //-------------------------------------------------------------------------
    // EVENTS
    //-------------------------------------------------------------------------
    event LockPeriodUpdated(uint256 lockPeriod);
    event NFTLocked(address indexed owner, uint256 indexed tokenId);
    event NFTUnLocked(address indexed owner, uint256 indexed tokenId);
    event RewardsClaimed(address indexed owner, uint256 indexed tokenId, uint256 rewards);

    constructor(address _rewardToken, address _stakeNFT, address _rewardNFT) {
        require(_rewardToken != address(0), "Invalid reward token");
        require(_stakeNFT != address(0), "Invalid stake NFT");
        require(_rewardNFT != address(0), "Invalid reward NFT");
        require(IERC165(_rewardNFT).supportsInterface(0x80ac58cd), "Non-erc721");
        require(IERC165(_stakeNFT).supportsInterface(0x80ac58cd), "Non-erc721");

        rewardToken = IERC20(_rewardToken);
        stakeNFT = IERC721(_stakeNFT);
        rewardNFT = IERC721(_rewardNFT);
    }

    /** MODIFIERS */
    modifier notContract() {
        require(!address(msg.sender).isContract(), "Contract not allowed");
        require(msg.sender == tx.origin, "Proxy contract not allowed");
        _;
    }

    /** SETTERS */
    /**
    * @dev update lock period
    * @param _lockPeriod lock period to set
    */
    function setLockPeriod(uint256 _lockPeriod) external onlyOwner {
        require(_lockPeriod > 0, "Invalid lock period.");
        lockPeriod = _lockPeriod;

        emit LockPeriodUpdated(_lockPeriod);
    }

    /**
    * @dev lock NFT into the contract
    * @param _tokenId token id to stake
    */
    function lockNFT(uint256 _tokenId) external notContract {
        stakeNFT.transferFrom(msg.sender, address(this), _tokenId);
        lockInfo[_tokenId] = LockInfo(msg.sender, block.timestamp, _tokenId, 0, false);

        emit NFTLocked(msg.sender, _tokenId);
    }

    /**
    * @dev unlock NFT from the contract
    * @param _tokenId token id to unlock
    */
    function unlockNFT(uint256 _tokenId) external notContract {
        LockInfo memory info = lockInfo[_tokenId];
        require(info.owner == msg.sender, "Not a token owner");
        require(info.lockedTime + lockPeriod < block.timestamp, "Not able to claim yet");
        require(!info.isUnlocked, "Already unlocked");

        stakeNFT.transferFrom(address(this), msg.sender, _tokenId);
        
        uint256 totalAmount = _rewardAmount(_tokenId);
        uint256 unclaminedAmount = totalAmount - info.claimedRewards;
        rewardToken.transferFrom(vaultWallet, msg.sender, unclaminedAmount);

        lockInfo[_tokenId].claimedRewards = totalAmount;
        lockInfo[_tokenId].isUnlocked = true;

        emit NFTUnLocked(msg.sender, _tokenId);
    }

    /**
    * @dev claim rewards
    * @param _tokenId token id to unlock
    */
    function claimRewards(uint256 _tokenId) external notContract {
        LockInfo memory info = lockInfo[_tokenId];
        require(info.owner == msg.sender, "Not a token owner");
        require(info.lockedTime + lockPeriod < block.timestamp, "Not able to claim yet");

        uint256 totalAmount = _rewardAmount(_tokenId);
        uint256 unclaminedAmount = totalAmount - info.claimedRewards;
        rewardToken.transferFrom(vaultWallet, msg.sender, unclaminedAmount);

        lockInfo[_tokenId].claimedRewards = totalAmount;

        emit RewardsClaimed(msg.sender, _tokenId, unclaminedAmount);
    }

    /**
    * @dev calculate reward amount
    */
    function _rewardAmount(uint256 _tokenId) internal view returns (uint256) {
        LockInfo memory info = lockInfo[_tokenId];
        uint256 stakingDuration = block.timestamp - info.lockedTime;
        uint256 totalAmount;

        if(stakingDuration < lockPeriod) {
            return 0;
        }
        else{
            // TODO; need to calculate APY
            totalAmount = rewardAmount + apyAmount * stakingDuration / lockPeriod;
            return totalAmount;
        }
    }
}