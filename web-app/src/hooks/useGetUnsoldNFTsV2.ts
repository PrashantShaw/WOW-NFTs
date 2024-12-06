"use client";
import {
  getPinataImageUrl,
  getRequiredEthChain,
  parseNFT,
  splitTokenUri,
} from "@/lib/utils";
import { LOCALSTORAGE_KEYS, NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { RawNFT, UnsoldMarketItem } from "@/lib/definitions";
import { useMemo } from "react";
import { useReadContract } from "wagmi";
import useLocalStorage from "./useLocalStorage";

export const useGetUnsoldNFTsV2 = (enabled = true) => {
  const {
    data: rawNFTs,
    isPending: isFetchingUnsoldNFTs,
    error: unsoldNFTsFetchError,
    queryKey,
    refetch: fetchUnsoldNFTs,
  } = useReadContract({
    address: NFT_CONTRACT_CONFIG.address,
    abi: NFT_CONTRACT_CONFIG.abi,
    functionName: "fetchUnsoldMarketItem",
    chainId: getRequiredEthChain().id,
    query: { enabled, refetchOnWindowFocus: false },
  });
  const { setItem } = useLocalStorage();
  console.log("useGetUnsoldNFTsV2 hook called", rawNFTs);

  const unsoldNFTs = useMemo(() => {
    if (!rawNFTs) return [];

    const newNFTsFirst = rawNFTs.reduce(
      (acc: UnsoldMarketItem[], rawNft: RawNFT) => {
        const { owner, price, seller, sold, tokenId, tokenURI } =
          parseNFT(rawNft);
        const [itemName, category, ipfsHash] = splitTokenUri(tokenURI);

        const imageUrl = getPinataImageUrl(ipfsHash);
        const nftMarketItem = {
          tokenId,
          seller,
          owner,
          price,
          sold,
          imageUrl,
          itemName,
          category,
          ipfsHash,
        };
        acc.push(nftMarketItem);

        return acc;
      },
      []
    );

    setItem(LOCALSTORAGE_KEYS.getUnsoldNFTs, queryKey);
    return newNFTsFirst;
  }, [rawNFTs, setItem, queryKey]);

  return {
    unsoldNFTs,
    isPending: isFetchingUnsoldNFTs,
    unsoldNFTsFetchError,
    queryKey,
    fetchUnsoldNFTs,
  };
};
