"use client";

import { useAccount } from "wagmi";
import { useGetNFT } from "./useGetNFT";
import { useGetNFTMetadata } from "./useGetNFTMetadata";
import { useMemo } from "react";
import {
  NFTMarketItem,
  PinataFileMetadata,
  UnsoldMarketItem,
} from "@/lib/definitions";
import { NftFormData } from "@/app/(root)/(NFT)/nft/create/_components/CreateNftForm";
import { getWeiFromEth } from "@/lib/utils";
import { usePreviewNFT } from "./usePreviewNFT";

export const useGetNFTMarketItem = (tokenId: string, isPreview = false) => {
  const previewCtx = usePreviewNFT();
  const { address } = useAccount();
  const nftFetchEnabled = !isPreview;
  const {
    NFT: fetchedNft,
    isFetchingNFT,
    NFTFetchError,
  } = useGetNFT(tokenId, nftFetchEnabled);

  const nftMetadataFetchEnabled = !isPreview && fetchedNft !== null;
  const { pinataFileMetadata, isFetchingMetadata, pinataMetadataError } =
    useGetNFTMetadata(
      nftMetadataFetchEnabled ? fetchedNft.ipfsHash : "",
      nftMetadataFetchEnabled
    );

  const nftMetadata = useMemo(
    () =>
      pinataFileMetadata
        ? (pinataFileMetadata.filesMeta[0].metadata
            .keyvalues as PinataFileMetadata)
        : ({} as PinataFileMetadata),
    [pinataFileMetadata]
  );

  const nft: NFTMarketItem = useMemo(() => {
    if (isPreview && previewCtx?.previewData) {
      const { category, description, itemName, nftImage, price, website } =
        previewCtx?.previewData ?? ({} as NftFormData);
      const imageUrl = URL.createObjectURL(nftImage[0]);
      const data: NFTMarketItem = {
        tokenId,
        seller: address as `0x${string}`,
        owner: address as `0x${string}`,
        sold: false,
        imageUrl,
        category,
        description,
        itemName,
        price: getWeiFromEth(price).toString(),
        website,
      };
      return data;
    }
    return { ...(fetchedNft ?? ({} as UnsoldMarketItem)), ...nftMetadata };
  }, [
    isPreview,
    previewCtx?.previewData,
    fetchedNft,
    nftMetadata,
    tokenId,
    address,
  ]);

  return {
    nft,
    isFetchingNFT,
    NFTFetchError,
    isFetchingMetadata,
    pinataMetadataError,
  };
};
