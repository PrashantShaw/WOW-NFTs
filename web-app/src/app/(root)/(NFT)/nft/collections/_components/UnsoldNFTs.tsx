"use client";
import { useGetUnsoldNFTs } from "@/hooks/useGetUnsoldNFTs";
import { getEthFromWei } from "@/lib/utils";
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
        <div>
          {unsoldNFTs.map((nft) => (
            <div key={nft.tokenId}>
              {nft.itemName} - {getEthFromWei(Number(nft.price)) + " ETH"} -{" "}
              {nft.imageUrl}
            </div>
          ))}
        </div>
      ) : (
        <div>NFT Collection is empty</div>
      )}
    </div>
  );
};

export default UnsoldNFTs;
