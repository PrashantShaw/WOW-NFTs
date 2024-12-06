"use client";

import * as React from "react";
import { Loader2, Search } from "lucide-react";

import { cn, getEthFromWei, textCapitalize } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetUnsoldNFTsV2 } from "@/hooks/useGetUnsoldNFTsV2";
import { useRouter } from "next/navigation";

export function SearchModal() {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } =
    useGetUnsoldNFTsV2(true);

  const searchResults = React.useMemo(
    () =>
      inputValue.trim() === ""
        ? []
        : unsoldNFTs.filter(
            (nft) =>
              nft.itemName.toLowerCase().includes(inputValue) ||
              nft.category.toLowerCase().includes(inputValue)
          ),
    [inputValue, unsoldNFTs]
  );

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    setSelectedIndex(searchResults.length > 0 ? 0 : -1);
  }, [inputValue, searchResults.length]);

  const handleKeyDownOnInput = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const selectedResult = searchResults[selectedIndex];
        const tokenId = selectedResult.tokenId;
        router.push(`/nft/${tokenId}`);
        setOpen(false);
      }
    },
    [router, searchResults, selectedIndex]
  );
  const handleMouseOverOnSearchResult = React.useCallback(
    (e: React.MouseEvent) => {
      const currIdx = Number(e.currentTarget.getAttribute("data-index") ?? -1);
      setSelectedIndex(currIdx);
      console.log("Mouse Over:", searchResults[currIdx]);
    },
    [searchResults]
  );
  const handleClickOnSearchResult = React.useCallback(
    (e: React.MouseEvent) => {
      const currIdx = Number(e.currentTarget.getAttribute("data-index") ?? -1);
      const selectedResult = searchResults[currIdx];
      const tokenId = selectedResult.tokenId;
      router.push(`/nft/${tokenId}`);
      setOpen(false);
    },
    [router, searchResults]
  );

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-72"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search NFTs, Creators...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-[1.625rem] select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘ K</span>
        </kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0" aria-describedby={undefined}>
          <div
            className="flex items-center border-b px-3"
            cmdk-input-wrapper=""
          >
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              className="flex h-11 w-full border-0 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Type to search..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDownOnInput}
            />
          </div>
          <DialogTitle className="hidden">Search Dialog</DialogTitle>
          <ScrollArea className="h-72">
            {isPending ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-4">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    data-index={index}
                    className={cn(
                      "cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      index === selectedIndex
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    )}
                    onMouseOver={handleMouseOverOnSearchResult}
                    onClick={handleClickOnSearchResult}
                  >
                    <div className="flex items-center justify-between">
                      <div className="">
                        <p className="font-semibold">
                          <span className="text-muted-foreground pr-2">
                            #{result.tokenId}
                          </span>
                          {result.itemName}
                        </p>
                        <p className="text-muted-foreground pl-6 text-xs">
                          {textCapitalize(result.category)}
                        </p>
                      </div>
                      <div className="font-bold">
                        {getEthFromWei(Number(result.price))} ETH
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-4 text-sm text-muted-foreground">
                No results found.
              </p>
            )}
            {unsoldNFTsFetchError ? (
              <p className="text-destructive font-semibold text-center">
                Error fetching NFTs
              </p>
            ) : null}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
