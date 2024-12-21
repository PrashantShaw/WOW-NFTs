"use client";
import useBuyNFT from "@/hooks/useBuyNFT";
import useSellNFT from "@/hooks/useSellNFT";
import clsx from "clsx";
import { CircleDollarSign, LoaderCircle, ShoppingBag } from "lucide-react";
import { useAccount } from "wagmi";

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
  const { sellNFT, isSellingNFT, isFetchingListingPrice } = useSellNFT();
  return (
    <div
      className={clsx(
        "flex items-center justify-center gap-2 text-primary-foreground bg-green-700 hover:bg-green-700/90 h-full w-full py-3",
        !isFetchingListingPrice ? "pointer-events-none opacity-50" : ""
      )}
      onClick={() => {
        // TODO: replace the price with actual price
        sellNFT(tokenId, "");
      }}
    >
      {isSellingNFT ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <>
          <CircleDollarSign size={18} /> <p className="text-sm">Sell Now</p>
        </>
      )}
    </div>
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
      className="flex items-center justify-center gap-2 text-primary-foreground bg-primary hover:bg-primary/90 h-full w-full py-3"
      onClick={() => {
        buyNFT(tokenId, priceWei);
      }}
    >
      {isBuyingNFT ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <>
          <ShoppingBag size={18} /> <p className="text-sm">Buy Now</p>
        </>
      )}
    </div>
  );
};

export default NFTCardHoverActions;
