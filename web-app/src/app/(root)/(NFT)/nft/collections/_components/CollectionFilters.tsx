"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NFT_CATEGORIES } from "@/lib/constants";
import { textCapitalize } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";

type CollectionFiltersProps = {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
};
const CollectionFilters = ({ setFilter }: CollectionFiltersProps) => {
  const categoriesLen = NFT_CATEGORIES.length + 1;
  const tabListClasses = `sm:grid sm:grid-cols-${categoriesLen}`;
  return (
    <div className="pt-[2.5rem]">
      <h1 className="text-5xl font-bold mb-4">A collection of awesome NFTs</h1>
      <p className="mb-10">
        Choose a awesome NFT for your display picture right here and now with
        just few clicks. Suit your taste and filter out the best!
      </p>
      {/* filter tabs - all, art, characters, entertainment */}
      <div className="pt-4">
        <Tabs
          defaultValue="all"
          className="max-w-2xl"
          onValueChange={setFilter}
        >
          <TabsList className={tabListClasses}>
            <TabsTrigger value="all">All</TabsTrigger>
            {NFT_CATEGORIES.map((category, idx) => (
              <TabsTrigger key={idx} value={category}>
                {textCapitalize(category)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default CollectionFilters;
