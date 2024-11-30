"use client";
import { getPinataImageUrl, getRequiredEthChain, parseNFT } from "@/lib/utils";
import { LOCALSTORAGE_KEYS, NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { RawNFT, NFTMarketItem, PinataFileMetadata } from "@/lib/definitions";
import { useMemo } from "react";
import { useReadContract } from "wagmi";
import useLocalStorage from "./useLocalStorage";
import { useQuery } from "@tanstack/react-query";
import { PinListItem } from "pinata-web3";

export const useGetUnsoldNFTs = (enabled = true) => {
  const {
    data: rawNFTs,
    isPending: isFetchingUnsoldNFTs,
    error: unsoldNFTsFetchError,
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

  console.log(
    "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
    rawNFTs,
    pinataFileMetadata
  );

  const unsoldNFTs = useMemo(() => {
    if (!rawNFTs || !pinataFileMetadata) return [];

    const nftMetadataList = pinataFileMetadata.files;
    const newNFTsFirst = rawNFTs.reduce(
      (acc: NFTMarketItem[], rawNft: RawNFT) => {
        const {
          owner,
          price,
          seller,
          sold,
          tokenId,
          tokenURI: ipfsHash,
        } = parseNFT(rawNft);
        const nftMetadata = nftMetadataList.find(
          (item) => item.ipfs_pin_hash === ipfsHash
        );
        if (!nftMetadata) return acc;

        const { itemName, description, category, website } = nftMetadata
          .metadata.keyvalues as PinataFileMetadata;
        const imageUrl = getPinataImageUrl(ipfsHash);
        const nftMarketItem = {
          tokenId,
          seller,
          owner,
          price,
          sold,
          imageUrl,
          itemName,
          description,
          category,
          website,
        };
        acc.push(nftMarketItem);

        return acc;
      },
      []
    );

    setItem(LOCALSTORAGE_KEYS.getUnsoldNFTs, queryKey);
    return newNFTsFirst;
  }, [rawNFTs, pinataFileMetadata, setItem, queryKey]);

  return {
    unsoldNFTs,
    isPending: isFetchingUnsoldNFTs || isFetchingMetadata,
    unsoldNFTsFetchError,
    pinataMetadataError,
    queryKey,
  };
};
