import { ETH_CHAINS } from "./constants";

export type ETH_NETWORKS = keyof typeof ETH_CHAINS;

export type RawNFT = {
  tokenId: bigint;
  seller: `0x${string}`;
  owner: `0x${string}`;
  price: bigint;
  sold: boolean;
};

export type NFT = {
  tokenId: string;
  seller: `0x${string}`;
  owner: `0x${string}`;
  price: string;
  sold: boolean;
};

export type NFTFileUploadResponseData = {
  IpfsHash: string;
  url: string;
};
