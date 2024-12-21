import { UnsoldMarketItem } from "@/lib/definitions";
import { NFTCard } from "./NFTCard";
import NFTCardSkeleton from "./NFTCardSkeleton";
import { ReadContractErrorType } from "viem";
import { applyFilters, SortByTypes } from "@/lib/utils";
import { CookingPot } from "lucide-react";
// import { PinListItem } from "pinata-web3";

type UnsoldNFTsProps = {
  unsoldNFTs: UnsoldMarketItem[];
  isPending: boolean;
  unsoldNFTsFetchError: ReadContractErrorType | null;
  filter: string;
  sortBy: SortByTypes;
  count?: number;
};
const UnsoldNFTs = ({
  unsoldNFTs,
  isPending,
  unsoldNFTsFetchError,
  filter,
  sortBy,
  count,
}: UnsoldNFTsProps) => {
  if (isPending)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 py-[4rem]">
        <NFTCardSkeleton />
        <NFTCardSkeleton />
        <NFTCardSkeleton />
      </div>
    );
  if (unsoldNFTsFetchError)
    return (
      <div className="text-center text-red-500 font-semibold pt-10">
        {unsoldNFTsFetchError.shortMessage}
      </div>
    );

  const filteredNFTs = applyFilters(unsoldNFTs, filter, sortBy, count);
  return (
    <div>
      {filteredNFTs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 py-[4rem]">
          {filteredNFTs.map((nft) => (
            <NFTCard key={nft.tokenId} nft={nft} />
          ))}
        </div>
      ) : (
        <div className="grid place-items-center gap-4 text-muted-foreground pt-32 pb-28 rounded-lg">
          <CookingPot className="w-[3rem] h-[3rem]" strokeWidth={1} />
          <p className="text-center font-medium text-xl ">
            This collection is empty!
          </p>
        </div>
      )}
    </div>
  );
};

export default UnsoldNFTs;
