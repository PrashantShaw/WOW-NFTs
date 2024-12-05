"use client";

import { useState } from "react";
import CollectionFilters from "./CollectionFilters";
import UnsoldNFTs from "./UnsoldNFTs";
import { useGetUnsoldNFTsV2 } from "@/hooks/useGetUnsoldNFTsV2";

const CollectionsWrapper = () => {
  const [filter, setFilter] = useState("all");
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } =
    useGetUnsoldNFTsV2(true);

  return (
    <div>
      <CollectionFilters filter={filter} setFilter={setFilter} />
      <UnsoldNFTs
        filter={filter}
        unsoldNFTs={unsoldNFTs}
        isPending={isPending}
        unsoldNFTsFetchError={unsoldNFTsFetchError}
      />
    </div>
  );
};

export default CollectionsWrapper;
