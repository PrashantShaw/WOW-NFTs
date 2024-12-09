import { UnsoldMarketItem } from "@/lib/definitions";
import { getEthFromWei, shortedAccountAddress } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const NFTCard = ({ nft }: { nft: UnsoldMarketItem }) => {
  return (
    <Link href={`/nft/${nft.tokenId}`}>
      <div className="shadow bg-gray-50 dark:bg-gray-900 overflow-hidden rounded-lg aspect-[3/4] flex flex-col group/nftCard">
        <div className="flex-grow overflow-hidden flex">
          <Image
            src={nft.imageUrl}
            className="flex-1 object-cover group-hover/nftCard:scale-105 transition-all duration-300"
            alt="NFT Image"
            width={300}
            height={300}
          />
        </div>
        <div className="p-3">
          <p className="font-semibold">
            {nft.itemName} #{nft.tokenId}
          </p>
          <p className="text-lg font-bold pt-2">
            {getEthFromWei(Number(nft.price)) + " ETH"}
          </p>
          <p className="text-xs text-muted-foreground">
            Seller: {shortedAccountAddress(nft.seller)}
          </p>
        </div>
      </div>
    </Link>
  );
};
