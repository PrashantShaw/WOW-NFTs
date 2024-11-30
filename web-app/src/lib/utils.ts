import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ETH_CHAINS, NFT_CONTRACT_CONFIG, WEI_IN_ONE_ETH } from "./constants";
import { ETH_NETWORKS, NFT, RawNFT } from "./definitions";
import { readContract } from "@wagmi/core";
import { getConfig } from "@/app/wagmi";

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
