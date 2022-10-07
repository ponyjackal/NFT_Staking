// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.4;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract StakeNFT is ERC721A, Ownable {
    string private _baseTokenURI;

    /** EVENTS */
    event TokenMinted(address indexed to, uint256 amount);

    constructor(string memory _baseuri) ERC721A("Rewards NFT", "RWN") {
        _baseTokenURI = _baseuri;
    }

    /** VIEW FUNCTIONS */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();

        string memory baseURI = _baseURI();
        return bytes(baseURI).length != 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId), ".json")) : "";
    }

    /** MUTATIVE FUNCTIONS */

    function ownerMint(address _to, uint256 _amount) external onlyOwner {
        require(_to != address(0), "Invalid address");

        _mint(_to, _amount);

        emit TokenMinted(_to, _amount);
    }
}
