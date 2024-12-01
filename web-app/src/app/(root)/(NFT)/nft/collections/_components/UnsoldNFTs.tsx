"use client";
import { useGetUnsoldNFTs } from "@/hooks/useGetUnsoldNFTs";
import { NFTMarketItem } from "@/lib/definitions";
import { getEthFromWei, shortedAccountAddress } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
// import { PinListItem } from "pinata-web3";

// type UnsoldNFTsProps = {
//   nftMetadata: PinListItem[];
// };
const UnsoldNFTs = () => {
  const { unsoldNFTs, isPending, pinataMetadataError, unsoldNFTsFetchError } =
    useGetUnsoldNFTs(true);

  console.log("pinataMetadataError :", pinataMetadataError);
  console.log("unsoldNFTsFetchError :", unsoldNFTsFetchError);
  console.log("unsoldNFTs :", unsoldNFTs);

  if (isPending) return <div>Pending...</div>;
  if (pinataMetadataError) return <div>{pinataMetadataError.message}</div>;
  if (unsoldNFTsFetchError)
    return <div>{unsoldNFTsFetchError.shortMessage}</div>;

  return (
    <div>
      {unsoldNFTs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 py-[4rem]">
          {unsoldNFTs.map((nft) => (
            <>
              <NFTCard key={nft.tokenId} nft={nft} />
            </>
          ))}
        </div>
      ) : (
        <div>NFT Collection is empty</div>
      )}
    </div>
  );
};

export default UnsoldNFTs;

const NFTCard = ({ nft }: { nft: NFTMarketItem }) => {
  return (
    <Link href={"/"}>
      <div className="shadow bg-gray-50 dark:bg-gray-900 overflow-hidden rounded-lg aspect-[3/4] flex flex-col group/nftCard">
        <div className="flex-grow overflow-hidden flex">
          <Image
            src={nft.imageUrl}
            className="flex-1 object-cover group-hover/nftCard:scale-105 transition-all duration-300"
            alt="NFT Image"
            width={300}
            height={300}
          />
        </div>
        <div className="p-3">
          <p className="font-semibold">
            {nft.itemName} #{nft.tokenId}
          </p>
          <p className="text-lg font-bold pt-2">
            {getEthFromWei(Number(nft.price)) + " ETH"}
          </p>
          <p className="text-xs text-muted-foreground">
            Owner: {shortedAccountAddress(nft.owner)}
          </p>
        </div>
      </div>
    </Link>
  );
};
