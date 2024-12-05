import { UnsoldMarketItem } from "@/lib/definitions";
import { NFTCard } from "./NFTCard";
import NFTCardSkeleton from "./NFTCardSkeleton";
import { ReadContractErrorType } from "viem";
// import { PinListItem } from "pinata-web3";

type UnsoldNFTsProps = {
  filter: string;
  unsoldNFTs: UnsoldMarketItem[];
  isPending: boolean;
  unsoldNFTsFetchError: ReadContractErrorType | null;
};
const UnsoldNFTs = ({
  filter,
  unsoldNFTs,
  isPending,
  unsoldNFTsFetchError,
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

  const filteredNFTs =
    filter === "all"
      ? unsoldNFTs
      : unsoldNFTs.filter(
          (nft) => nft.category.toLowerCase() === filter.toLowerCase()
        );

  return (
    <div>
      {filteredNFTs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 py-[4rem]">
          {filteredNFTs.map((nft) => (
            <NFTCard key={nft.tokenId} nft={nft} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground font-semibold pt-10">
          NFT Collection is empty
        </div>
      )}
    </div>
  );
};

export default UnsoldNFTs;
