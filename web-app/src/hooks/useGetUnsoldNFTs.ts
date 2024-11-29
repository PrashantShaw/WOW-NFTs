"use client";
import { getRequiredEthChain, parseNFT } from "@/lib/utils";
import { LOCALSTORAGE_KEYS, NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { RawNFT, NFT } from "@/lib/definitions";
import { useMemo } from "react";
import { useReadContract } from "wagmi";
import useLocalStorage from "./useLocalStorage";
import { useQuery } from "@tanstack/react-query";
import { PinListItem } from "pinata-web3";

export const useGetUnsoldNFTs = (enabled = true) => {
  const {
    data: rawNFTs,
    isPending: isFetchingUnsoldNFTs,
    error,
    queryKey,
  } = useReadContract({
    address: NFT_CONTRACT_CONFIG.address,
    abi: NFT_CONTRACT_CONFIG.abi,
    functionName: "fetchUnsoldMarketItem",
    chainId: getRequiredEthChain().id,
    query: { enabled, refetchOnWindowFocus: false },
  });
  const { setItem } = useLocalStorage();
  console.log("useGetUnsoldNFTs hook called", rawNFTs);

  const {
    data: pinataFileMetadata,
    isPending: isFetchingMetadata,
    error: pinataMetadataError,
  } = useQuery<{
    files: PinListItem[];
  }>({
    queryKey: [LOCALSTORAGE_KEYS.pinataFilesMetadata],
    queryFn: async () => {
      const response = await fetch("/api/nft-meta", {
        method: "GET",
      });
      return response.json();
    },
    enabled,
    refetchOnWindowFocus: false,
  });

  console.log("pinataFileMetadata :", pinataFileMetadata);
  console.log("pinataMetadataError :", pinataMetadataError);

  const unsoldNFTs = useMemo(() => {
    if (!rawNFTs || !pinataFileMetadata) return [];

    // TODO: merge pinataFileMetadata with the nft data which is to be rendered
    const newNFTsFirst = rawNFTs.reduce((acc: NFT[], rawNft: RawNFT) => {
      const parsedNFTData = parseNFT(rawNft);
      acc.push(parsedNFTData);

      return acc;
    }, []);

    setItem(LOCALSTORAGE_KEYS.getUnsoldNFTs, queryKey);
    return newNFTsFirst;
  }, [rawNFTs, pinataFileMetadata, setItem, queryKey]);

  return {
    unsoldNFTs,
    isPending: isFetchingUnsoldNFTs || isFetchingMetadata,
    error,
    queryKey,
  };
};
