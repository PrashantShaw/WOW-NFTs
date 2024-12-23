"use client";

import { LOCALSTORAGE_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { PinListItem } from "pinata-web3";
import { useCallback } from "react";

export const useGetNFTMetadata = (ipfsHash: string, enabled = true) => {
  const nftMetaQueryKey = [LOCALSTORAGE_KEYS.pinataFilesMetadata, ipfsHash];

  const fetchNftMeta = useCallback(async (ipfsHash: string) => {
    const nftMetadataApiUrl = `/api/v2/nft-meta?cid=${ipfsHash}`;
    const response = await fetch(nftMetadataApiUrl, {
      method: "GET",
    });
    return response.json();
  }, []);

  const {
    data: pinataFileMetadata,
    isPending,
    error: pinataMetadataError,
  } = useQuery<{
    filesMeta: PinListItem[];
  }>({
    queryKey: nftMetaQueryKey,
    queryFn: () => fetchNftMeta(ipfsHash),
    enabled,
    refetchOnWindowFocus: false,
  });

  return {
    pinataFileMetadata,
    isFetchingMetadata: enabled ? isPending : false,
    pinataMetadataError,
  };
};
