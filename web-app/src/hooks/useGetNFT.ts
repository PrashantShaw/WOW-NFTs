"use client";
import {
  getPinataImageUrl,
  getRequiredEthChain,
  parseNFT,
  splitTokenUri,
} from "@/lib/utils";
import { NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { UnsoldMarketItem } from "@/lib/definitions";
import { useMemo } from "react";
import { useReadContract } from "wagmi";

// TODO: modify contract to return null if token not found!
export const useGetNFT = (tokenId: string, enabled = true) => {
  const {
    data: rawNFT,
    isPending: isFetchingNFT,
    error: NFTFetchError,
    queryKey,
    refetch: fetchNFT,
  } = useReadContract({
    address: NFT_CONTRACT_CONFIG.address,
    abi: NFT_CONTRACT_CONFIG.abi,
    functionName: "fetchNFTByTokenId",
    args: [BigInt(enabled ? tokenId : "0")],
    chainId: getRequiredEthChain().id,
    query: { enabled, refetchOnWindowFocus: false },
  });
  console.log("useGetNFT hook called", rawNFT);
  console.log("queryKey ::", queryKey);

  const NFT = useMemo(() => {
    if (!rawNFT) return null;

    const { owner, price, seller, sold, tokenId, tokenURI } = parseNFT(rawNFT);
    const [itemName, category, ipfsHash] = splitTokenUri(tokenURI);
    const imageUrl = getPinataImageUrl(ipfsHash);
    const nftItem: UnsoldMarketItem = {
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

    return nftItem;
  }, [rawNFT]);

  return {
    NFT,
    isFetchingNFT: enabled ? isFetchingNFT : false,
    NFTFetchError,
    queryKey,
    fetchNFT,
  };
};
