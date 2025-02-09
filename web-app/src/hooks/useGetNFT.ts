"use client";
import {
  getPinataImageUrl,
  getRequiredEthChain,
  parseNFT,
  splitTokenUri,
} from "@/lib/utils";
import { NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { UnsoldMarketItem } from "@/lib/definitions";
import { useCallback, useMemo } from "react";
import { useReadContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const invalidateQuery = useCallback(
    (tokenId: string) => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey as [
            string,
            { functionName: string; args: [bigint] }
          ];
          return (
            queryKey[0] === "readContract" &&
            queryKey[1]?.functionName === "fetchNFTByTokenId" &&
            queryKey[1]?.args[0] === BigInt(tokenId)
          );
        },
      });
    },
    [queryClient]
  );

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
    invalidateQuery,
  };
};
