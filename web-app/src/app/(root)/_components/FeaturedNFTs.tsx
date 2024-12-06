"use client";

import { useGetUnsoldNFTsV2 } from "@/hooks/useGetUnsoldNFTsV2";
import UnsoldNFTs from "../(NFT)/nft/collections/_components/UnsoldNFTs";

const FeaturedNFTs = () => {
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } =
    useGetUnsoldNFTsV2(true);
  return (
    <div className="pt-[3.5rem]">
      <h2 className="text-4xl font-semibold tracking-tight first:mt-0 mb-4">
        Featured Items
      </h2>
      <p className="mb-4 text-muted-foreground">
        Explore a curated selection of extraordinary NFTs, handpicked just for
        you. Dive into the world of Featured NFTs today!
      </p>
      <UnsoldNFTs
        unsoldNFTs={unsoldNFTs}
        isPending={isPending}
        unsoldNFTsFetchError={unsoldNFTsFetchError}
        filter={"all"}
        count={5}
      />
    </div>
  );
};

export default FeaturedNFTs;
