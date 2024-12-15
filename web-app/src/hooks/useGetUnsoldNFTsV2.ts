"use client";
import {
  getPinataImageUrl,
  getRequiredEthChain,
  parseNFT,
  splitTokenUri,
} from "@/lib/utils";
import { NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { RawNFT, UnsoldMarketItem } from "@/lib/definitions";
import { useMemo } from "react";
import { useReadContract } from "wagmi";

export const useGetUnsoldNFTsV2 = (enabled = true) => {
  const PAGE_INDEX = 0;
  const LIMIT = 100;
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
    args: [BigInt(PAGE_INDEX), BigInt(LIMIT)],
    chainId: getRequiredEthChain().id,
    query: { enabled, refetchOnWindowFocus: false },
  });
  console.log("useGetUnsoldNFTsV2 hook called", rawNFTs);
  console.log("queryKey ::", queryKey);
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

    return newNFTsFirst;
  }, [rawNFTs]);

  return {
    unsoldNFTs,
    isPending: isFetchingUnsoldNFTs,
    unsoldNFTsFetchError,
    queryKey,
    fetchUnsoldNFTs,
  };
};
