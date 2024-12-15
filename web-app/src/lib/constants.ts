import { NFT_ABI } from "@/abi/NFTMarketplace";
import { defineChain } from "viem";
import { mainnet, sepolia, holesky } from "wagmi/chains";
import {
  ArrowDownAZ,
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
  ArrowDownZA,
  ListRestart,
} from "lucide-react";

export const NAV_LINKS = [
  { label: "Collections", href: "/nft/collections" },
  { label: "Featured", href: "/#featuredNFTs" },
  { label: "Learn", href: "/#learn" },
  // { label: "About", href: "/" },
] as const;

export const NFT_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as `0x${string}`;

export const LOCALSTORAGE_KEYS = {
  isUserRegistered: "isUserRegistered",
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

export const WEI_IN_ONE_ETH = 10 ** 18;

export const ETH_CHAINS = {
  holesky,
  sepolia,
  mainnet,
  hardhat_localhost,
} as const;

export const PINATA_FILE_METADATA_NAME = "NFTMARKETPLACE_PINATA";

export const BRAND = {
  name: "WOW NFTs",
  owner: "Prashant Shaw",
  github: "https://github.com/PrashantShaw",
  linkedin: "https://www.linkedin.com/in/prashant-shaw/",
  twitter: "https://x.com/ImPrashantShaw",
} as const;

export const NFT_CATEGORIES = ["character", "art", "entertainment"] as const;

export const EDUCATIONAL_Q_AND_A = [
  {
    question: "What is a Blockchain?",
    answer:
      "Blockchain is a secure, decentralized database that stores data in blocks that are linked together in a chain. It's also known as Distributed Ledger Technology (DLT). Satoshi Nakamoto is credited with inventing blockchain technology in 2009 with the creation of Bitcoin. Bitcoin was intended to be a secure, decentralized, global currency that could be used as a medium of exchange.",
  },
  {
    question: "What Are NFTs??",
    answer:
      "Non-fungible tokens (NFTs) are unique digital assets that are stored on a blockchain and represent ownership of a specific asset. Digital or real-world items like artwork, collectibles, virtual real estate, music, videos, or any other form of digital media. NFTs were created in 2014, but their popularity peaked between 2021 and 2022. While NFTs have sold for millions, they're highly speculative assets that aren't for everyone.",
  },
  {
    question: "How is NFT different from cryptocurrency??",
    answer:
      "The main difference between NFTs (Non-Fungible Tokens) and cryptocurrencies is that NFTs are unique and cannot be exchanged one-to-one, while cryptocurrencies are fungible. Both NFTs and cryptocurrencies operate on blockchain technology. However, NFTs are typically developed using the same type of programming as cryptocurrencies like Bitcoin or Ethereum. ",
  },
  {
    question: "How does an NFT make money??",
    answer:
      "Every time an NFT is purchased, the NFT creator receives a portion of the sale price and on any subsequent sales of that NFT, which essentially acts like a royalty in perpetuity that benefits the NFT creator. Typical royalty percentages range from 5% to 15%.",
  },
  {
    question: "How create an NFT??",
    answer:
      "Connect your metamask wallet using the button from the navbar. After successfully connecting your wallet, click on the Create button near your profile avatar. On the Create NFT page, add NFT item and fill the details about it, then pay the listing price so that your NFT can be listed on the NFT market.",
  },
];

export const SORT_BY_TYPES = [
  {
    sortBy: "none",
    label: "Reset",
    iconName: ListRestart,
  },
  {
    sortBy: "low-to-high",
    label: "Price low to high",
    iconName: ArrowDownNarrowWide,
  },
  {
    sortBy: "high-to-low",
    label: "Price high to low",
    iconName: ArrowDownWideNarrow,
  },
  {
    sortBy: "A-to-Z",
    label: "A to Z",
    iconName: ArrowDownAZ,
  },
  {
    sortBy: "Z-to-A",
    label: "Z to A",
    iconName: ArrowDownZA,
  },
];

export const RANK_MEDALS = ["🥇", "🥈", "🥉"];
