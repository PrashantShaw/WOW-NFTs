"use client";

import { useGetUnsoldNFTs } from "@/hooks/useGetUnsoldNFTs";
// import { PinListItem } from "pinata-web3";

// type UnsoldNFTsProps = {
//   nftMetadata: PinListItem[];
// };
const UnsoldNFTs = () => {
  const { unsoldNFTs, isPending, error } = useGetUnsoldNFTs(true);

  if (isPending) return <div>Pending...</div>;
  if (error) return <div>{error.shortMessage}</div>;

  return (
    <div>
      {unsoldNFTs.length > 0 ? (
        <div>
          {unsoldNFTs.map((nft) => (
            <div key={nft.tokenId}>{nft.tokenId}</div>
          ))}
        </div>
      ) : (
        <div>NFT Collection is empty</div>
      )}
    </div>
  );
};

export default UnsoldNFTs;
