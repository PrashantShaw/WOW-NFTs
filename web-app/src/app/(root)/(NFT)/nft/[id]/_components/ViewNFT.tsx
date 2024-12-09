"use client";

import { useGetNFTMetadata } from "@/hooks/useGetNFTMetadata";
import { useGetUnsoldNFTsV2 } from "@/hooks/useGetUnsoldNFTsV2";
import {
  NFTMarketItem,
  PinataFileMetadata,
  UnsoldMarketItem,
} from "@/lib/definitions";

type ViewNFTProps = {
  id: string;
  isPreview?: boolean;
};
// TODO: create buy/sell btn based on seller fo the item
const ViewNFT = ({ id, isPreview = false }: ViewNFTProps) => {
  const unsoldNFTsFetchEnabled = !isPreview;
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } = useGetUnsoldNFTsV2(
    unsoldNFTsFetchEnabled
  );

  const nftToShow = isPreview
    ? ([] as UnsoldMarketItem[])
    : unsoldNFTs.filter((unsoldNFT) => unsoldNFT.tokenId === id);

  const nftMetadataFetchEnabled = !isPreview && nftToShow.length > 0;
  const { pinataFileMetadata, isFetchingMetadata, pinataMetadataError } =
    useGetNFTMetadata(
      nftToShow.length > 0 ? nftToShow[0].ipfsHash : "",
      nftMetadataFetchEnabled
    );

  // console.log("isFetchingMetadata :", isFetchingMetadata);
  // console.log("pinataFileMetadata :", pinataFileMetadata);
  // console.log("pinataMetadataError :", pinataMetadataError);

  const nftMetadata = pinataFileMetadata
    ? (pinataFileMetadata.filesMeta[0].metadata.keyvalues as PinataFileMetadata)
    : ({} as PinataFileMetadata);

  // TODO: fetch nft preview data from usePreviewNFT hook and add it here if isPreview is true
  const nft = isPreview
    ? ({} as NFTMarketItem)
    : { ...nftToShow[0], ...nftMetadata };

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
