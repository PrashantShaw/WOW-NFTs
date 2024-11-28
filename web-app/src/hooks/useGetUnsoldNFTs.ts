"use client";
import { getRequiredEthChain, parseNFT } from "@/lib/utils";
import { LOCALSTORAGE_KEYS, NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { RawNFT, NFT } from "@/lib/definitions";
import { useMemo } from "react";
import { useReadContract } from "wagmi";
import useLocalStorage from "./useLocalStorage";

export const useGetUnsoldNFTs = () => {
  const {
    data: rawNFTs,
    isPending,
    error,
    queryKey,
  } = useReadContract({
    address: NFT_CONTRACT_CONFIG.address,
    abi: NFT_CONTRACT_CONFIG.abi,
    functionName: "fetchUnsoldMarketItem",
    chainId: getRequiredEthChain().id,
    query: { enabled: true }, // optionally control the fetch whenever this hook is called
  });
  const { setItem } = useLocalStorage();
  console.log("useGetUnsoldNFTs hook called", rawNFTs);

  const unsoldNFTs = useMemo(() => {
    if (!rawNFTs) return [];

    const newNFTsFirst = rawNFTs.reduce((acc: NFT[], rawNft: RawNFT) => {
      const parsedNFTData = parseNFT(rawNft);
      acc.push(parsedNFTData);

      return acc;
    }, []);

    setItem(LOCALSTORAGE_KEYS.getAllTweetsQueryKey, queryKey);
    return newNFTsFirst;
  }, [rawNFTs, queryKey, setItem]);
  return { unsoldNFTs, isPending, error, queryKey };
};
