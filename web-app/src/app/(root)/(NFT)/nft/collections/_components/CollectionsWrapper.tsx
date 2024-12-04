"use client";

import { useState } from "react";
import CollectionFilters from "./CollectionFilters";
import { useGetUnsoldNFTs } from "@/hooks/useGetUnsoldNFTs";
import UnsoldNFTs from "./UnsoldNFTs";

const CollectionsWrapper = () => {
  const [filter, setFilter] = useState("all");
  const { unsoldNFTs, isPending, pinataMetadataError, unsoldNFTsFetchError } =
    useGetUnsoldNFTs(true);

  return (
    <div>
      <CollectionFilters filter={filter} setFilter={setFilter} />
      <UnsoldNFTs
        filter={filter}
        unsoldNFTs={unsoldNFTs}
        isPending={isPending}
        pinataMetadataError={pinataMetadataError}
        unsoldNFTsFetchError={unsoldNFTsFetchError}
      />
    </div>
  );
};

export default CollectionsWrapper;
