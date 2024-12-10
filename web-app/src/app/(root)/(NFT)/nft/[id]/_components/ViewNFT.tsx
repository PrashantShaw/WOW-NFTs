"use client";

import { useGetNFTMetadata } from "@/hooks/useGetNFTMetadata";
import { useGetUnsoldNFTsV2 } from "@/hooks/useGetUnsoldNFTsV2";
import { usePreviewNFT } from "@/hooks/usePreviewNFT";
import {
  NFTMarketItem,
  PinataFileMetadata,
  UnsoldMarketItem,
} from "@/lib/definitions";
import { NftFormData } from "../../create/_components/CreateNftForm";
import { useMemo } from "react";
import { useAccount } from "wagmi";

type ViewNFTProps = {
  id: string;
  isPreview?: boolean;
};
// TODO: create buy/sell btn based on seller fo the item
const ViewNFT = ({ id, isPreview = false }: ViewNFTProps) => {
  const unsoldNFTsFetchEnabled = !isPreview;
  const previewCtx = usePreviewNFT();
  const { address } = useAccount();
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } = useGetUnsoldNFTsV2(
    unsoldNFTsFetchEnabled
  );

  const fetchedNft = useMemo(
    () =>
      isPreview
        ? ([] as UnsoldMarketItem[])
        : unsoldNFTs.filter((unsoldNFT) => unsoldNFT.tokenId === id),
    [id, isPreview, unsoldNFTs]
  );

  const nftMetadataFetchEnabled = !isPreview && fetchedNft.length > 0;
  const { pinataFileMetadata, isFetchingMetadata, pinataMetadataError } =
    useGetNFTMetadata(
      fetchedNft.length > 0 ? fetchedNft[0].ipfsHash : "",
      nftMetadataFetchEnabled
    );

  // console.log("isFetchingMetadata :", isFetchingMetadata);
  // console.log("pinataFileMetadata :", pinataFileMetadata);
  // console.log("pinataMetadataError :", pinataMetadataError);

  const nftMetadata = useMemo(
    () =>
      pinataFileMetadata
        ? (pinataFileMetadata.filesMeta[0].metadata
            .keyvalues as PinataFileMetadata)
        : ({} as PinataFileMetadata),
    [pinataFileMetadata]
  );

  const nft: NFTMarketItem = useMemo(() => {
    if (isPreview) {
      const { category, description, itemName, nftImage, price, website } =
        previewCtx?.previewData ?? ({} as NftFormData);
      const imageUrl = URL.createObjectURL(nftImage[0]);
      const data: NFTMarketItem = {
        tokenId: id,
        seller: address as `0x${string}`,
        owner: address as `0x${string}`,
        sold: false,
        imageUrl,
        category,
        description,
        itemName,
        price: price.toString(),
        website,
      };
      return data;
    }
    return { ...fetchedNft[0], ...nftMetadata };
  }, [
    isPreview,
    fetchedNft,
    nftMetadata,
    previewCtx?.previewData,
    id,
    address,
  ]);

  if (unsoldNFTsFetchError || pinataMetadataError)
    return (
      <div className="text-center text-red-500 font-semibold pt-10">
        {unsoldNFTsFetchError?.shortMessage}
        {pinataMetadataError?.message}
      </div>
    );

  if (isPending)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 py-[4rem]">
        skeletons here...
      </div>
    );

  return (
    <div>
      {nft.itemName}-{nft.category}
      {isFetchingMetadata ? (
        <p>Fetching nft metadata...</p>
      ) : (
        <p>
          {nft.description} - {nft.website}
        </p>
      )}
    </div>
  );
};

export default ViewNFT;
