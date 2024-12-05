import { ETH_CHAINS } from "./constants";

export type ETH_NETWORKS = keyof typeof ETH_CHAINS;

export type RawNFT = {
  tokenId: bigint;
  seller: `0x${string}`;
  owner: `0x${string}`;
  price: bigint;
  sold: boolean;
  tokenURI: string;
};

export type NFT = {
  tokenId: string;
  seller: `0x${string}`;
  owner: `0x${string}`;
  price: string;
  sold: boolean;
  tokenURI: string;
};

export type NFTMarketItem = {
  tokenId: string;
  seller: `0x${string}`;
  owner: `0x${string}`;
  price: string;
  sold: boolean;
  imageUrl: string;
  itemName: string;
  description: string;
  category: string;
  website: string;
};

export type UnsoldMarketItem = Omit<NFTMarketItem, "description" | "website">;

export type PinataFileMetadata = {
  itemName: string;
  description: string;
  category: string;
  website: string;
};

export type NFTFileUploadResponseData = {
  ipfsHash: string;
  isDuplicate: string;
};
