"use client";

import { useGetUnsoldNFTsV2 } from "@/hooks/useGetUnsoldNFTsV2";
import { LOCALSTORAGE_KEYS } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { PinListItem } from "pinata-web3";

type ViewNFTProps = {
  id: string;
};
const ViewNFT = ({ id }: ViewNFTProps) => {
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } = useGetUnsoldNFTsV2();
  const nftToShow = unsoldNFTs.filter(
    (unsoldNFT) => unsoldNFT.tokenId === id
  )[0];
  const nftMetadataApiUrl = nftToShow
    ? `/api/v2/nft-meta?cid=${nftToShow.ipfsHash}`
    : "";
  const {
    data: pinataFileMetadata,
    isPending: isFetchingMetadata,
    error: pinataMetadataError,
  } = useQuery<{
    metadata: PinListItem[];
  }>({
    queryKey: [LOCALSTORAGE_KEYS.pinataFilesMetadata],
    queryFn: async () => {
      const response = await fetch(nftMetadataApiUrl, {
        method: "GET",
      });
      return response.json();
    },
    enabled: !isPending,
    refetchOnWindowFocus: false,
  });

  console.log("isFetchingMetadata :", isFetchingMetadata);
  console.log("pinataFileMetadata :", pinataFileMetadata);
  console.log("pinataMetadataError :", pinataMetadataError);

  if (unsoldNFTsFetchError)
    return (
      <div className="text-center text-red-500 font-semibold pt-10">
        {unsoldNFTsFetchError.shortMessage}
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
      {nftToShow.itemName}-{nftToShow.category}
    </div>
  );
};

export default ViewNFT;
