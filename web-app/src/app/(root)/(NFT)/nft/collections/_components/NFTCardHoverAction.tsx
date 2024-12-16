"use client";
import { CircleDollarSign, ShoppingBag } from "lucide-react";
import { useAccount } from "wagmi";

type NFTCardHoverActionProps = {
  owner: `0x${string}`;
  sold: boolean;
};
const NFTCardHoverAction = ({ owner, sold }: NFTCardHoverActionProps) => {
  const { address } = useAccount();
  const canSell = sold && owner === address;
  const canBuy = !sold && owner !== address;

  if (canBuy)
    return (
      <div className="flex items-center justify-center gap-2 text-primary-foreground bg-primary hover:bg-primary/90 h-full w-full py-3">
        <ShoppingBag size={18} /> <p className="text-sm">Buy Now</p>
      </div>
    );

  if (canSell)
    return (
      <div className="flex items-center justify-center gap-2 text-primary-foreground bg-green-700 hover:bg-green-700/90 h-full w-full py-3">
        <CircleDollarSign size={18} /> <p className="text-sm">Sell Now</p>
      </div>
    );

  return null;
};

export default NFTCardHoverAction;
