// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * ERC-721 is a standard for representing ownership of non-fungible tokens, that is, where each token is unique.
 */
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";
import "./CustomCounter.sol";

contract NFTMarketplace is ERC721URIStorage {
    using CustomCounter for CustomCounter.Counter;

    CustomCounter.Counter private _tokenIds;
    CustomCounter.Counter private _itemsSold;

    uint256 listingPrice = 0.0025 ether;

    // 'payable' is used so that address or function can send or receive eth
    address payable owner;

    mapping(uint256 => MarketItem) private idMartketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    event idMarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    // pass the name and symbol to the base 'ERC721' contract
    constructor() ERC721("NFT Metaverse Token", "MYNFT") {
        owner = payable(msg.sender); // cast 'address' to 'payable address'
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner of the marketplace can change the listing price."
        );
        _;
    }

    modifier onlyAtListingPrice() {
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price."
        );
        _;
    }

    function updateListingPrice(
        uint256 _listingPrice
    ) public payable onlyOwner {
        listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // CREATE NFT TOKEN
    function createToken(
        string memory tokenURI,
        uint256 price
    ) public payable returns (uint256 tokenId) {
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        createMarketItem(newTokenId, price);

        return newTokenId;
    }

    // CREATE MARKET ITEM
    function createMarketItem(
        uint256 tokenId,
        uint256 price
    ) private onlyAtListingPrice {
        require(price > 0, "Price must be greater than zero");

        idMartketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender), // initially, the creator will be the seller (who is listing the nft to the marketplace by paying some lisitng price)
            payable(address(this)), // 'this' means this contract, initially the nft belongs to this contract/marketplace
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId); // make contract/marketplace as the owner of the created token

        emit idMarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    // PUT THE TOKEN BACK TO CONTRACT/MARKETPLACE AT A DIFFERENT PRICE FOR RESALE
    function reSellToken(
        uint256 tokenId,
        uint256 price
    ) public payable onlyAtListingPrice {
        require(
            idMartketItem[tokenId].owner == msg.sender,
            "Only token owners are allowed to resell."
        );

        idMartketItem[tokenId].sold = false;
        idMartketItem[tokenId].price = price;
        idMartketItem[tokenId].seller = payable(msg.sender);
        idMartketItem[tokenId].owner = payable(address(this));

        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    // SALE TOKENS FROM CONTRACT/MARKETPLACE TO THE USER/BUYER
    function buyToken(uint256 tokenId) public payable {
        uint256 tokenPrice = idMartketItem[tokenId].price;

        require(
            msg.value == tokenPrice,
            "Please submit the asking price in order to complete the purchase"
        );

        idMartketItem[tokenId].sold = true;
        idMartketItem[tokenId].owner = payable(msg.sender);
        // idMartketItem[tokenId].seller = payable(address(0)); // address(0) is zero-address, a valid no-address

        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);

        payable(owner).transfer(listingPrice); // incentive for marketplace owner when token is sold
        payable(idMartketItem[tokenId].seller).transfer(msg.value); //seller gets the price value
    }

    // GET ALL UNSOLD NFT DATA
    function fetchUnsoldMarketItem() public view returns (MarketItem[] memory) {
        uint256 totalItems = _tokenIds.current();
        uint256 unsoldItemCount = totalItems - _itemsSold.current();
        uint256 currIdx = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        for (uint256 i = 1; i <= totalItems; i++) {
            if (
                idMartketItem[i].sold == false &&
                idMartketItem[i].owner == address(this)
            ) {
                items[currIdx] = idMartketItem[i]; // 'i' is the tokenId here, bcoz its an incremental integer from 1
                currIdx++;
            }
        }

        return items;
    }

    // GET PURCHASED NFTS BY A USER
    function fetchPurchasedNFTsByUser()
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 totalItems = _tokenIds.current();
        uint PurchasedNFTsByUserCount = 0;
        uint currIdx = 0;

        for (uint256 i = 1; i <= totalItems; i++) {
            if (idMartketItem[i].owner == msg.sender) {
                PurchasedNFTsByUserCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](PurchasedNFTsByUserCount);

        for (uint256 i = 1; i <= totalItems; i++) {
            if (idMartketItem[i].owner == msg.sender) {
                items[currIdx] = idMartketItem[i];
                currIdx++;
            }
        }

        return items;
    }

    // GET LISTED NFTS BY A USER
    function fetchListedNFTsByUser() public view returns (MarketItem[] memory) {
        uint256 totalItems = _tokenIds.current();
        uint listedNFTsByUserCount = 0;
        uint currIdx = 0;

        for (uint256 i = 1; i <= totalItems; i++) {
            if (idMartketItem[i].seller == msg.sender) {
                listedNFTsByUserCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](listedNFTsByUserCount);

        for (uint256 i = 1; i <= totalItems; i++) {
            if (idMartketItem[i].owner == msg.sender) {
                items[currIdx] = idMartketItem[i];
                currIdx++;
            }
        }

        return items;
    }
}
