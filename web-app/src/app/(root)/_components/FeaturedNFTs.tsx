"use client";

import { useGetUnsoldNFTsV2 } from "@/hooks/useGetUnsoldNFTsV2";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import NFTCardSkeleton from "../(NFT)/nft/collections/_components/NFTCardSkeleton";
import { NFTCard } from "../(NFT)/nft/collections/_components/NFTCard";
import toast from "react-hot-toast";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const FeaturedNFTs = () => {
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } =
    useGetUnsoldNFTsV2(true);
  const carouselAutoplayPlugin = useRef(Autoplay({ delay: 4000 }));

  if (unsoldNFTsFetchError) {
    toast.error("Failed to fetch NFTs", {
      position: "bottom-right",
      duration: 5000,
    });
  }
  return (
    <div className="pt-[4rem]" id="featuredNFTs">
      <h2 className="text-4xl font-semibold tracking-tight first:mt-0 mb-4 text-center">
        Featured Items
      </h2>
      <p className="mb-4 text-muted-foreground text-center text-balance">
        Explore a curated selection of extraordinary NFTs, handpicked just for
        you. Dive into the world of Featured NFTs today!
      </p>
      <Carousel
        className="w-full max-w-5xl mx-auto pt-[4.5rem]"
        opts={{ loop: true }}
        plugins={[carouselAutoplayPlugin.current]}
      >
        <CarouselContent>
          {isPending ? (
            <>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <NFTCardSkeleton />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <NFTCardSkeleton />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <NFTCardSkeleton />
              </CarouselItem>
            </>
          ) : unsoldNFTs.length > 0 ? (
            unsoldNFTs.map((nft) => (
              <CarouselItem
                key={nft.tokenId}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <NFTCard nft={nft} />
              </CarouselItem>
            ))
          ) : (
            <>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <div className="shadow bg-gray-50/80 dark:bg-gray-900 overflow-hidden rounded-lg aspect-[3/4] grid content-center text-center">
                  NFT Collection is empty
                </div>
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <div className="shadow bg-gray-50/80 dark:bg-gray-900 overflow-hidden rounded-lg aspect-[3/4] grid content-center text-center">
                  NFT Collection is empty
                </div>
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <div className="shadow bg-gray-50/80 dark:bg-gray-900 overflow-hidden rounded-lg aspect-[3/4] grid content-center text-center">
                  NFT Collection is empty
                </div>
              </CarouselItem>
            </>
          )}
        </CarouselContent>
        <CarouselPrevious className="left-4 opacity-20 hover:opacity-100 lg:opacity-100 lg:-left-12" />
        <CarouselNext className="right-4 opacity-20 hover:opacity-100 lg:opacity-100 lg:-right-12" />
      </Carousel>
    </div>
  );
};

export default FeaturedNFTs;
