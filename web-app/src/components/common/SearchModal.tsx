"use client";

import * as React from "react";
import { Loader2, Search } from "lucide-react";

import { cn, debounce } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock API function (replace with your actual API call)
const fetchSearchResults = async (query: string): Promise<string[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Return mock results based on query
  return [
    `Result for ${query} 1`,
    `Result for ${query} 2`,
    `Result for ${query} 3`,
  ];
};

const debouncedFetchSearchResults = debounce(fetchSearchResults, 300);

export function SearchModal() {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

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

  const handleSearch = React.useCallback(async (value: string) => {
    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await debouncedFetchSearchResults(value);
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    handleSearch(inputValue);
  }, [inputValue, handleSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
      // Handle selection (e.g., navigate to result page)
      console.log("Selected:", searchResults[selectedIndex]);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search NFTs,Creators...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-[1.625rem] select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘ K</span>
        </kbd>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0">
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
              onKeyDown={handleKeyDown}
            />
          </div>
          <ScrollArea className="h-72">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="p-4">
                {searchResults.map((result, index) => (
                  <div
                    key={index}
                    className={cn(
                      "cursor-default select-none rounded-sm px-2 py-1.5 text-sm outline-none",
                      index === selectedIndex
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground"
                    )}
                  >
                    {result}
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-4 text-sm text-muted-foreground">
                No results found.
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
