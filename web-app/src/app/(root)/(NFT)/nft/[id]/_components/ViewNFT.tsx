"use client";

import { useGetUnsoldNFTsV2 } from "@/hooks/useGetUnsoldNFTsV2";

type ViewNFTProps = {
  id: string;
};
const ViewNFT = ({ id }: ViewNFTProps) => {
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } = useGetUnsoldNFTsV2();

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

  const nftToShow = unsoldNFTs.filter(
    (unsoldNFT) => unsoldNFT.tokenId === id
  )[0];

  return (
    <div>
      {nftToShow.itemName}-{nftToShow.category}
    </div>
  );
};

export default ViewNFT;
