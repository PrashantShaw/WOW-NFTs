import { NFT_ABI } from "@/abi/NFTMarketplace";
import { defineChain } from "viem";
import { mainnet, sepolia } from "viem/chains";

export const NAV_LINKS = [
  { label: "Products", href: "/" },
  { label: "Services", href: "/" },
  { label: "Contacts", href: "/" },
  { label: "About", href: "/" },
] as const;

export const NFT_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`;

export const LOCALSTORAGE_KEYS = {
  isUserRegistered: "isUserRegistered",
  getUnsoldNFTs: "getUnsoldNFTs",
  pinataFilesMetadata: "pinataFilesMetadata",
} as const;

export const NFT_CONTRACT_CONFIG = {
  address: NFT_CONTRACT_ADDRESS,
  abi: NFT_ABI,
} as const;

export const hardhat_localhost = defineChain({
  id: 31337,
  name: "hardhat_localhost",
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
  nativeCurrency: {
    name: "GO",
    symbol: "GO",
    decimals: 18,
  },
});

export const ETH_CHAINS = {
  sepolia,
  mainnet,
  hardhat_localhost,
} as const;

export const PINATA_FILE_METADATA_NAME = "NFTMARKETPLACE_PINATA";
