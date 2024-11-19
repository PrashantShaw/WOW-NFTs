import React from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";

const SearchNFTs = () => {
  return (
    <Button
      variant={"outline"}
      className="w-full lg:w-[14rem] md:w-[8rem] text-sm flex justify-between"
    >
      <p className="hidden lg:block text-foreground/50">Search NFTs...</p>
      <p className="lg:hidden text-foreground/50">Search... </p>
      <Search className="text-foreground/50" />
    </Button>
  );
};

export default SearchNFTs;
