"use client";

import { useGetUnsoldNFTsV2 } from "@/hooks/useGetUnsoldNFTsV2";
import {
  getEthFromWei,
  getEthPriceUsd,
  getTopCreators,
  shortedAccountAddress,
} from "@/lib/utils";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RANK_MEDALS } from "@/lib/constants";

const TopCreators = () => {
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } = useGetUnsoldNFTsV2();
  const topCreators = useMemo(() => getTopCreators(unsoldNFTs), [unsoldNFTs]);

  console.log("#################", topCreators);
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
            <TableHead>Address</TableHead>
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
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      {shortedAccountAddress(creator.address)}
                    </p>
                    <Button variant={"ghost"} size={"icon"}>
                      <Copy />
                    </Button>
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
