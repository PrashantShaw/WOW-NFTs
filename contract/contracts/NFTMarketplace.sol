// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./CustomCounter.sol";

contract NFTMarketplace is ERC721URIStorage {
    using CustomCounter for CustomCounter.Counter;

    CustomCounter.Counter private _tokenIds;
    CustomCounter.Counter private _itemsSold;

    uint256 private listingPrice = 0.0025 ether;
    address payable private marketplaceOwner;

    mapping(uint256 => MarketItem) private idMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    struct MarketItemWithURI {
        uint256 tokenId;
        address seller;
        address owner;
        uint256 price;
        bool sold;
        string tokenURI;
    }

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    constructor() ERC721("NFT Marketplace Token", "MYNFT") {
        marketplaceOwner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require(
            msg.sender == marketplaceOwner,
            "Only marketplace owner can call this function"
        );
        _;
    }

    modifier validateListingPrice() {
        require(
            msg.value == listingPrice,
            "Price must be equal to the listing price"
        );
        _;
    }

    function updateListingPrice(uint256 _listingPrice) external onlyOwner {
        listingPrice = _listingPrice;
    }

    function getListingPrice() external view returns (uint256) {
        return listingPrice;
    }

    function createToken(
        string memory tokenURI,
        uint256 price
    ) external payable validateListingPrice returns (uint256) {
        require(price > 0, "Price must be greater than zero");

        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _createMarketItem(newTokenId, price);

        return newTokenId;
    }

    function _createMarketItem(uint256 tokenId, uint256 price) private {
        idMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    function resellToken(
        uint256 tokenId,
        uint256 price
    ) external payable validateListingPrice {
        MarketItem storage item = idMarketItem[tokenId];

        require(
            item.owner == msg.sender,
            "Only the owner of the token can resell"
        );
        require(price > 0, "Price must be greater than zero");

        item.sold = false;
        item.price = price;
        item.seller = payable(msg.sender);
        item.owner = payable(address(this));

        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    function buyToken(uint256 tokenId) external payable {
        MarketItem storage item = idMarketItem[tokenId];

        require(msg.value == item.price, "Incorrect payment amount");
        require(!item.sold, "Token already sold");

        item.owner = payable(msg.sender);
        item.sold = true;

        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);

        payable(marketplaceOwner).transfer(listingPrice);
        payable(item.seller).transfer(msg.value - listingPrice);
    }

    function fetchUnsoldMarketItem(
        uint256 startIndex,
        uint256 limit
    ) external view returns (MarketItemWithURI[] memory) {
        uint256 totalItems = _tokenIds.current();
        uint256 unsoldCount = totalItems - _itemsSold.current();
        uint256 fetchedCount = 0;

        limit = (startIndex + limit > unsoldCount)
            ? unsoldCount - startIndex
            : limit;

        MarketItemWithURI[] memory paginatedItems = new MarketItemWithURI[](
            limit
        );

        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= totalItems && fetchedCount < limit; i++) {
            if (
                !idMarketItem[i].sold && idMarketItem[i].owner == address(this)
            ) {
                if (currentIndex >= startIndex) {
                    MarketItem storage item = idMarketItem[i];
                    paginatedItems[fetchedCount] = MarketItemWithURI({
                        tokenId: item.tokenId,
                        seller: item.seller,
                        owner: item.owner,
                        price: item.price,
                        sold: item.sold,
                        tokenURI: tokenURI(item.tokenId)
                    });
                    fetchedCount++;
                }
                currentIndex++;
            }
        }

        return paginatedItems;
    }

    function fetchPurchasedNFTsByUser()
        external
        view
        returns (MarketItemWithURI[] memory)
    {
        uint256 totalItems = _tokenIds.current();
        uint256 purchasedCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 1; i <= totalItems; i++) {
            if (idMarketItem[i].sold && idMarketItem[i].owner == msg.sender) {
                purchasedCount++;
            }
        }

        MarketItemWithURI[] memory purchasedItems = new MarketItemWithURI[](
            purchasedCount
        );

        for (uint256 i = 1; i <= totalItems; i++) {
            if (idMarketItem[i].sold && idMarketItem[i].owner == msg.sender) {
                MarketItem storage item = idMarketItem[i];
                purchasedItems[currentIndex] = MarketItemWithURI({
                    tokenId: item.tokenId,
                    seller: item.seller,
                    owner: item.owner,
                    price: item.price,
                    sold: item.sold,
                    tokenURI: tokenURI(item.tokenId)
                });
                currentIndex++;
            }
        }

        return purchasedItems;
    }

    function fetchListedNFTsByUser()
        public
        view
        returns (MarketItemWithURI[] memory)
    {
        uint256 totalItems = _tokenIds.current();
        uint listedCount = 0;
        uint currIdx = 0;

        for (uint256 tokenId = 1; tokenId <= totalItems; tokenId++) {
            if (
                !idMarketItem[tokenId].sold &&
                idMarketItem[tokenId].seller == msg.sender
            ) {
                listedCount++;
            }
        }

        MarketItemWithURI[] memory listedItems = new MarketItemWithURI[](
            listedCount
        );

        for (uint256 tokenId = 1; tokenId <= totalItems; tokenId++) {
            if (
                !idMarketItem[tokenId].sold &&
                idMarketItem[tokenId].seller == msg.sender
            ) {
                MarketItem storage item = idMarketItem[tokenId];
                listedItems[currIdx] = MarketItemWithURI({
                    tokenId: item.tokenId,
                    seller: item.seller,
                    owner: item.owner,
                    price: item.price,
                    sold: item.sold,
                    tokenURI: tokenURI(item.tokenId)
                });
                currIdx++;
            }
        }

        return listedItems;
    }

    function fetchNFTByTokenId(
        uint256 tokenId
    ) public view returns (MarketItemWithURI memory) {
        MarketItem storage item = idMarketItem[tokenId];
        MarketItemWithURI memory requiredItem = MarketItemWithURI({
            tokenId: item.tokenId,
            seller: item.seller,
            owner: item.owner,
            price: item.price,
            sold: item.sold,
            tokenURI: tokenURI(item.tokenId)
        });

        return requiredItem;
    }
}
