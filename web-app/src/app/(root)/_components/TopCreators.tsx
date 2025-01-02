"use client";

import { useGetUnsoldNFTsV2 } from "@/hooks/useGetUnsoldNFTsV2";
import {
  copyToCLipboard,
  encodeText,
  getEthFromWei,
  getEthPriceUsd,
  getProfileGradientStyle,
  getTopCreators,
  shortedAccountAddress,
} from "@/lib/utils";
import { useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy, UserRoundSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RANK_MEDALS } from "@/lib/constants";
import Link from "next/link";
import toast from "react-hot-toast";

// TODO: add action section to table
const TopCreators = () => {
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } = useGetUnsoldNFTsV2();
  const topCreators = useMemo(() => getTopCreators(unsoldNFTs), [unsoldNFTs]);

  const handleCopyAccountAddress = useCallback(async (address: string) => {
    const copid = await copyToCLipboard(address);
    if (copid) {
      toast.success("Address Copied!", {
        position: "bottom-right",
      });
    } else {
      toast.error("Failed to copy address!", {
        position: "bottom-right",
      });
    }
  }, []);

  if (isPending) {
    return (
      <div className="text-center text-muted-foreground py-6">loading...</div>
    );
  }
  if (unsoldNFTsFetchError) {
    return (
      <div className="text-center text-destructive py-6">
        Error Fetching Top Creators!
      </div>
    );
  }

  return (
    <div className="pt-[8rem]" id="top-creators">
      <h2 className="text-4xl font-semibold tracking-tight first:mt-0 mb-4 text-center">
        Top Creators
      </h2>
      <p className="mb-4 text-muted-foreground text-center text-balance">
        Explore the top creators ranked by the total ETH value of their NFTs.
        This section showcases the most successful contributors in the
        marketplace, celebrated for their high-value creations.
      </p>
      <div className="h-[2rem]" />
      <Table className="max-w-5xl mx-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Rank</TableHead>
            <TableHead className="pl-[3.5rem]">Address</TableHead>
            <TableHead>Total Listings</TableHead>
            <TableHead>Total ETH value</TableHead>
            <TableHead className="text-right">Average ETH/NFT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topCreators.map((creator, idx) => {
            const listedNftsTotalPriceEth = getEthFromWei(
              creator.listedNftsTotalPriceWei
            );
            const listedNftsTotalPriceDollar = (
              getEthPriceUsd() * listedNftsTotalPriceEth
            ).toFixed(3);
            const perNftAveragePriceEth = getEthFromWei(
              creator.perNftAveragePriceWei
            );
            const perNftAveragePriceDollar = (
              getEthPriceUsd() * perNftAveragePriceEth
            ).toFixed(3);

            return (
              <TableRow key={idx}>
                <TableCell className="font-semibold">
                  {idx <= 3 ? (
                    <span className="text-xl">{RANK_MEDALS[idx]}</span>
                  ) : (
                    idx + 1
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className=" w-[2rem] h-[2rem] border rounded-md"
                      style={getProfileGradientStyle(creator.address)}
                    />
                    <p className="font-semibold">
                      {shortedAccountAddress(creator.address)}
                    </p>
                    <div className="flex pl-1 gap-1">
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onClick={() =>
                          handleCopyAccountAddress(creator.address)
                        }
                      >
                        <Copy />
                      </Button>
                      <Button asChild variant={"ghost"} size={"icon"}>
                        <Link
                          href={`/user/${encodeText(creator.address)}`}
                          target="_blank"
                        >
                          <UserRoundSearch />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {creator.listedCount}
                </TableCell>
                <TableCell>
                  <p className="font-semibold">
                    {listedNftsTotalPriceEth} ETH{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      (${listedNftsTotalPriceDollar})
                    </span>
                  </p>
                </TableCell>
                <TableCell className="text-right font-semibold">
                  <p className="font-semibold">
                    {perNftAveragePriceEth} ETH{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      (${perNftAveragePriceDollar})
                    </span>
                  </p>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TopCreators;
