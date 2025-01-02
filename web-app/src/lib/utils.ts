import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ETH_CHAINS, NFT_CONTRACT_CONFIG, WEI_IN_ONE_ETH } from "./constants";
import {
  ETH_NETWORKS,
  NFT,
  RawNFT,
  TopCreator,
  UnsoldMarketItem,
} from "./definitions";
import { readContract } from "@wagmi/core";
import { getConfig } from "@/app/wagmi";
import bs58 from "bs58";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number
) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    return new Promise((resolve) => {
      timeout = setTimeout(() => resolve(func(...args)), waitFor); //+
    });
  };
}

export const getRequiredEthChain = () => {
  const ETH_NETWORK =
    (process.env.NEXT_PUBLIC_ETH_NETWORK as ETH_NETWORKS) || "holesky";

  return ETH_CHAINS[ETH_NETWORK];
};

export const shortedAccountAddress = (address: `0x${string}`) => {
  return (address?.substring(0, 6) + "..." + address?.slice(-5)).toUpperCase();
};

export const parseNFT = (rawNFT: RawNFT): NFT => ({
  tokenId: rawNFT.tokenId.toString(),
  seller: rawNFT.seller,
  owner: rawNFT.owner,
  price: rawNFT.price.toString(),
  sold: rawNFT.sold,
  tokenURI: rawNFT.tokenURI,
});

export const getListingPrice = async () => {
  const listingPrice = await readContract(getConfig(), {
    abi: NFT_CONTRACT_CONFIG.abi,
    address: NFT_CONTRACT_CONFIG.address,
    functionName: "getListingPrice",
  });

  return Number(listingPrice);
};

export const getEthFromWei = (wei: number) => {
  const ETH_FROM_WEI = wei / WEI_IN_ONE_ETH;

  return ETH_FROM_WEI;
};
export const getWeiFromEth = (eth: number) => {
  const WEI_FROM_ETH = eth * WEI_IN_ONE_ETH;

  return WEI_FROM_ETH;
};

export const getPinataImageUrl = (pinataIpfsHash: string) => {
  const PINATA_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "";
  const pinataImageUrl = `https://${PINATA_GATEWAY_URL}/ipfs/${pinataIpfsHash}`;

  return pinataImageUrl;
};

export const textCapitalize = (text: string) =>
  text.replace(/\b[a-z]/g, (match) => match.toUpperCase());

export const createTokenUri = (
  itemName: string,
  category: string,
  ipfsHash: string
) => `${itemName}::${category}::${ipfsHash}`;

export const splitTokenUri = (tokenUri: string) =>
  tokenUri.split("::") as [
    itemName: string,
    category: string,
    ipfsHash: string
  ];

const sortByExpressions = {
  "low-to-high": (a: UnsoldMarketItem, b: UnsoldMarketItem): number =>
    Number(a.price) - Number(b.price),
  "high-to-low": (a: UnsoldMarketItem, b: UnsoldMarketItem): number =>
    Number(b.price) - Number(a.price),
  "A-to-Z": (a: UnsoldMarketItem, b: UnsoldMarketItem): number =>
    a.itemName < b.itemName ? -1 : 1,
  "Z-to-A": (a: UnsoldMarketItem, b: UnsoldMarketItem): number =>
    a.itemName > b.itemName ? -1 : 1,
};

export type SortByTypes = keyof typeof sortByExpressions | "none";

export const applyFilters = (
  nfts: UnsoldMarketItem[],
  filterText: string,
  sortBy: SortByTypes,
  count?: number
): UnsoldMarketItem[] => {
  const filteredByTextNFTs =
    filterText === "all"
      ? nfts.slice(0, count)
      : nfts
          .filter(
            (nft) => nft.category.toLowerCase() === filterText.toLowerCase()
          )
          .slice(0, count);

  const SortedByTypeNFTs =
    sortBy === "none"
      ? filteredByTextNFTs
      : filteredByTextNFTs.sort((a, b) => sortByExpressions[sortBy](a, b));

  return SortedByTypeNFTs;
};

export const copyToCLipboard = async (text: string) => {
  if (!window || !window.navigator) return false;

  await navigator.clipboard.writeText(text);
  return true;
};

export const getEthPriceUsd = () => 3799.66;

export const getTopCreators = (
  unsoldNFTs: UnsoldMarketItem[],
  count = 10
): TopCreator[] => {
  const topCreatorsMap = new Map<`0x${string}`, TopCreator>();
  unsoldNFTs.forEach((nft) => {
    if (topCreatorsMap.has(nft.seller)) {
      const creatorObj = topCreatorsMap.get(nft.seller);
      const listedNftsTotalPriceWei =
        (creatorObj?.listedNftsTotalPriceWei ?? 0) + Number(nft.price);
      const listedCount = (creatorObj?.listedCount ?? 0) + 1;
      const perNftAveragePriceWei = listedNftsTotalPriceWei / listedCount;
      topCreatorsMap.set(nft.seller, {
        address: nft.seller,
        listedNftsTotalPriceWei,
        listedCount,
        perNftAveragePriceWei,
      });
    } else {
      topCreatorsMap.set(nft.seller, {
        address: nft.seller,
        listedNftsTotalPriceWei: Number(nft.price),
        listedCount: 1,
        perNftAveragePriceWei: Number(nft.price),
      });
    }
  });
  const topCreatorsArr = Array.from(topCreatorsMap)
    .reduce((acc, curr) => [...acc, curr[1]], [] as TopCreator[])
    .sort((a, b) => b.listedNftsTotalPriceWei - a.listedNftsTotalPriceWei)
    .slice(0, count);

  return topCreatorsArr;
};

export const encodeText = (text: string | `0x${string}`) => {
  const enc = new TextEncoder();
  const bytes = enc.encode(text); // UTF-8 byte array
  return bs58.encode(bytes); // Base58 encode
};

export const decodeText = (encoded: string) => {
  const bytes = bs58.decode(encoded); // Base58 decode
  return new TextDecoder().decode(bytes); // Convert back to string
};

export const validateAccountAddress = (address: string) => {
  const accountRegex = /^0x[a-fA-F0-9]{40}$/;
  const isValidAccountAddress = accountRegex.test(address);
  return isValidAccountAddress;
};
