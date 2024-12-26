"use client";
import useBuyNFT from "@/hooks/useBuyNFT";
import useSellNFT from "@/hooks/useSellNFT";
import clsx from "clsx";
import {
  CircleDollarSign,
  CircleX,
  LoaderCircle,
  ShoppingBag,
} from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getEthFromWei, getWeiFromEth } from "@/lib/utils";
import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type NFTCardHoverActionsProps = {
  owner: `0x${string}`;
  sold: boolean;
  tokenId: string;
  priceWei: string;
};
const NFTCardHoverActions = ({
  owner,
  sold,
  tokenId,
  priceWei,
}: NFTCardHoverActionsProps) => {
  const { address } = useAccount();
  const canSell = sold && owner === address;
  const canBuy = !sold && owner !== address;

  if (canBuy) return <BuyHoverAction tokenId={tokenId} priceWei={priceWei} />;
  if (canSell) return <SellHoverAction tokenId={tokenId} />;

  return null;
};

export const SellHoverAction = ({ tokenId }: { tokenId: string }) => {
  const [newPrice, setNewPrice] = useState<string>();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { sellNFT, listingPriceWei, isSellingNFT, isFetchingListingPrice } =
    useSellNFT();

  const listingPriceEth = useMemo(
    () => getEthFromWei(Number(listingPriceWei ?? 0)),
    [listingPriceWei]
  );

  const handleSellToken = useCallback(async () => {
    if (newPrice === "" || newPrice === undefined) {
      setError("Required!");
      return;
    }
    const price = Number(newPrice);
    const isNan = isNaN(price);
    if (isNan) {
      setError("Input is not a number!");
      return;
    }
    const isLess = price <= listingPriceEth;
    if (isLess) {
      setError("Price must be greater than the listing price!");
      return;
    }
    const newPriceWei = getWeiFromEth(Number(price));
    try {
      const result = await sellNFT(tokenId, newPriceWei.toString());
      if (result.success) {
        router.replace("/nft/collections");
      }
    } catch (error: unknown | Error) {
      console.log("Error Selling nft!", error);
      toast.error("Failed to Sell NFT!", {
        duration: 5000,
        position: "bottom-right",
      });
    }
  }, [listingPriceEth, newPrice, router, sellNFT, tokenId]);
  const handleOnPriceChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setNewPrice(e.target.value);
    },
    []
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className={clsx(
            "flex items-center justify-center gap-2 text-primary-foreground bg-green-700 hover:bg-green-700/90 h-full w-full py-3",
            isFetchingListingPrice ? "pointer-events-none opacity-50" : ""
          )}
        >
          {isSellingNFT ? (
            <>
              {" "}
              <LoaderCircle className="animate-spin" />{" "}
              <p className="text-sm">Loading</p>
            </>
          ) : (
            <>
              <CircleDollarSign size={18} /> <p className="text-sm">Sell Now</p>
            </>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sell NFT</DialogTitle>
          <DialogDescription>
            <ul className="list-disc pl-4 pt-2">
              <li>
                Set a new price for this NFT in order to list it on the
                marketplace.
              </li>
              <li>The new price should be greater than the listing price.</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              New Price for NFT
            </Label>
            <p className="text-primary font-semibold text-xs">
              Lising price: {listingPriceEth} ETH
            </p>
            <div className="flex relative">
              <Input
                className={clsx(
                  "rounded-tr-none rounded-br-none border-r-0 focus-visible:ring-offset-0 z-20",
                  error ? "ring-2 ring-red-600  focus-visible:ring-red-600" : ""
                )}
                type="number"
                id="link"
                placeholder="New NFT price in ETH"
                value={newPrice}
                onChange={handleOnPriceChange}
              />
              <div className="bg-muted rounded-tr-md rounded-br-md grid place-items-center text-muted-foreground text-sm px-2 z-10">
                ETH
              </div>
              {error ? (
                <p className="absolute left-0 top-[100%] text-destructive text-xs pt-1">
                  {error}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start pt-4">
          <div className="grid grid-cols-2 w-full gap-2 sm:gap-3">
            <Button
              type="button"
              variant="default"
              onClick={handleSellToken}
              disabled={isSellingNFT}
            >
              {isSellingNFT ? (
                <>
                  <LoaderCircle className="animate-spin" /> Loading
                </>
              ) : (
                <>
                  <CircleDollarSign /> Sell
                </>
              )}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                <CircleX /> Close
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const BuyHoverAction = ({
  tokenId,
  priceWei,
}: {
  tokenId: string;
  priceWei: string;
}) => {
  const { buyNFT, isBuyingNFT } = useBuyNFT();

  return (
    <div
      className={clsx(
        "flex items-center justify-center gap-2 text-primary-foreground bg-primary hover:bg-primary/90 h-full w-full py-3",
        isBuyingNFT ? "pointer-events-none opacity-50" : ""
      )}
      onClick={() => {
        // TODO: wrap this in try catch
        buyNFT(tokenId, priceWei);
      }}
    >
      {isBuyingNFT ? (
        <>
          <LoaderCircle className="animate-spin" size={18} />{" "}
          <p className="text-sm">Buying...</p>
        </>
      ) : (
        <>
          <ShoppingBag size={18} /> <p className="text-sm">Buy Now</p>
        </>
      )}
    </div>
  );
};

export default NFTCardHoverActions;
