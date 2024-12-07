"use client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NFT_CATEGORIES, SORT_BY_TYPES } from "@/lib/constants";
import { SortByTypes, textCapitalize } from "@/lib/utils";
import {
  Dispatch,
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
} from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideProps } from "lucide-react";

type CollectionFiltersProps = {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  sortBy: SortByTypes;
  setSortBy: Dispatch<SetStateAction<SortByTypes>>;
};
const CollectionFilters = ({
  setFilter,
  sortBy,
  setSortBy,
}: CollectionFiltersProps) => {
  return (
    <div className="pt-[2.5rem]">
      <h1 className="text-5xl font-bold mb-4">A collection of awesome NFTs</h1>
      <p className="mb-10">
        Choose a awesome NFT for your display picture right here and now with
        just few clicks. Suit your taste and filter out the best!
      </p>
      <div className="pt-4 flex justify-between items-center flex-wrap gap-2">
        {/* filter tabs - all, art, characters, entertainment */}
        <Tabs
          defaultValue="all"
          className="max-w-2xl"
          onValueChange={setFilter}
        >
          <TabsList className="sm:grid sm:grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            {NFT_CATEGORIES.map((category, idx) => (
              <TabsTrigger key={idx} value={category}>
                {textCapitalize(category)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        {/* sort btns - */}
        <div className="space-x-2">
          {SORT_BY_TYPES.map((type, idx) => (
            <SortByButton
              key={idx}
              active={type.sortBy === sortBy}
              onClick={() => {
                setSortBy(type.sortBy as SortByTypes);
              }}
              tooltipLabel={type.label}
              iconComponent={type.iconName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

type SortByButtonProps = {
  onClick: () => void;
  tooltipLabel: string;
  active: boolean;
  iconComponent: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};
const SortByButton = ({
  active,
  onClick,
  tooltipLabel,
  iconComponent: Icon,
}: SortByButtonProps) => {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={onClick}
            size={"icon"}
            variant={active ? "default" : "secondary"}
          >
            <Icon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{tooltipLabel}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CollectionFilters;
