import { mainnet, sepolia } from "viem/chains";

export const NAV_LINKS = [
  { label: "Products", href: "/" },
  { label: "Services", href: "/" },
  { label: "Contacts", href: "/" },
  { label: "About", href: "/" },
] as const;

export const ETH_CHAINS = {
  sepolia,
  mainnet,
} as const;

export const NFT_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`;

export const LOCALSTORAGE_KEYS = {
  isUserRegistered: "isUserRegistered",
  getAllTweetsQueryKey: "getAllTweetsQueryKey",
} as const;

export const NFT_CONTRACT_CONFIG = {
  address: NFT_CONTRACT_ADDRESS,
  abi: "NFT_ABI", // TODO: replace with actual abi
} as const;
