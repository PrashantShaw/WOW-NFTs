"use client";

import { useState } from "react";
import CollectionFilters from "./CollectionFilters";
import UnsoldNFTs from "./UnsoldNFTs";
import { useGetUnsoldNFTsV2 } from "@/hooks/useGetUnsoldNFTsV2";
import { SortByTypes } from "@/lib/utils";

const CollectionsWrapper = () => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortByTypes>("none");
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } =
    useGetUnsoldNFTsV2(true);

  return (
    <div>
      <CollectionFilters
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <UnsoldNFTs
        unsoldNFTs={unsoldNFTs}
        isPending={isPending}
        unsoldNFTsFetchError={unsoldNFTsFetchError}
        filter={filter}
        sortBy={sortBy}
      />
    </div>
  );
};

export default CollectionsWrapper;
