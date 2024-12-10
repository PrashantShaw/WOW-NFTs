"use client";

import { useGetNFTMetadata } from "@/hooks/useGetNFTMetadata";
import { useGetUnsoldNFTsV2 } from "@/hooks/useGetUnsoldNFTsV2";
import { usePreviewNFT } from "@/hooks/usePreviewNFT";
import {
  NFTMarketItem,
  PinataFileMetadata,
  UnsoldMarketItem,
} from "@/lib/definitions";
import { NftFormData } from "../../create/_components/CreateNftForm";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  getEthFromWei,
  shortedAccountAddress,
  textCapitalize,
} from "@/lib/utils";
import Link from "next/link";
import {
  ArrowLeftFromLine,
  Copy,
  Ellipsis,
  ShoppingBag,
  SquareArrowOutUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ViewNFTProps = {
  id: string;
  isPreview?: boolean;
};
// TODO: create buy/sell btn based on seller fo the item
const ViewNFT = ({ id, isPreview = false }: ViewNFTProps) => {
  const unsoldNFTsFetchEnabled = !isPreview;
  const previewCtx = usePreviewNFT();
  const router = useRouter();

  (() => {
    if (isPreview && !previewCtx?.previewData) {
      router.replace("/nft/create");
    }
  })();

  const [isNftImageLoading, setIsNftImageLoading] = useState(true);
  const { address } = useAccount();
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } = useGetUnsoldNFTsV2(
    unsoldNFTsFetchEnabled
  );

  const fetchedNft = useMemo(
    () =>
      isPreview
        ? ([] as UnsoldMarketItem[])
        : unsoldNFTs.filter((unsoldNFT) => unsoldNFT.tokenId === id),
    [id, isPreview, unsoldNFTs]
  );

  const nftMetadataFetchEnabled = !isPreview && fetchedNft.length > 0;
  const { pinataFileMetadata, isFetchingMetadata, pinataMetadataError } =
    useGetNFTMetadata(
      fetchedNft.length > 0 ? fetchedNft[0].ipfsHash : "",
      nftMetadataFetchEnabled
    );

  // console.log("isFetchingMetadata :", isFetchingMetadata);
  // console.log("pinataFileMetadata :", pinataFileMetadata);
  // console.log("pinataMetadataError :", pinataMetadataError);

  const nftMetadata = useMemo(
    () =>
      pinataFileMetadata
        ? (pinataFileMetadata.filesMeta[0].metadata
            .keyvalues as PinataFileMetadata)
        : ({} as PinataFileMetadata),
    [pinataFileMetadata]
  );

  const nft: NFTMarketItem = useMemo(() => {
    if (isPreview) {
      const { category, description, itemName, nftImage, price, website } =
        previewCtx?.previewData ?? ({} as NftFormData);
      const imageUrl = URL.createObjectURL(nftImage[0]);
      const data: NFTMarketItem = {
        tokenId: id,
        seller: address as `0x${string}`,
        owner: address as `0x${string}`,
        sold: false,
        imageUrl,
        category,
        description,
        itemName,
        price: price.toString(),
        website,
      };
      return data;
    }
    return { ...fetchedNft[0], ...nftMetadata };
  }, [
    isPreview,
    fetchedNft,
    nftMetadata,
    previewCtx?.previewData,
    id,
    address,
  ]);

  if (unsoldNFTsFetchError || pinataMetadataError)
    return (
      <div className="text-center text-red-500 font-semibold pt-10">
        {unsoldNFTsFetchError?.shortMessage}
        {pinataMetadataError?.message}
      </div>
    );

  if (isPending)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 py-[4rem]">
        skeletons here...
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[3rem]">
      <div className="">
        {/* TODO: add a loader while image is be fetched */}
        {isNftImageLoading ? (
          <div className="grid place-content-center bg-muted aspect-[3/4] rounded-md animate-pulse">
            <Image
              src={"/image-placeholder.png"}
              alt="NFT Image Placeholder"
              width={768}
              height={768}
              className=" w-full"
            />
          </div>
        ) : null}
        <Image
          src={nft.imageUrl}
          alt="NFT image"
          width={768}
          height={768}
          className={clsx(
            "rounded-xl",
            isNftImageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsNftImageLoading(false)}
          onError={() => setIsNftImageLoading(false)}
        />
      </div>
      <div className="">
        <div className="flex items-center justify-between gap-2 pb-6">
          <Badge variant="default" className="text-lg">
            {textCapitalize(nft.category)}
          </Badge>
          <Button variant={"ghost"} size={"icon"}>
            <Ellipsis />
          </Button>
        </div>
        <h2 className="text-3xl font-bold">
          {nft.itemName}{" "}
          <span className="text-muted-foreground">#{nft.tokenId}</span>
        </h2>
        <div className="pt-7">
          <p className="text-muted-foreground text-sm">Description:</p>
          {isFetchingMetadata ? (
            <div className="h-7 w-[80%] bg-secondary rounded-md animate-pulse" />
          ) : (
            <p className="font-medium text-lg">{nft.description}</p>
          )}
        </div>
        <div className="pt-3">
          <p className="text-muted-foreground text-sm">Seller:</p>
          <p className="font-medium text-lg flex items-center gap-1">
            {shortedAccountAddress(nft.seller)}{" "}
            <Button size={"icon"} variant={"ghost"}>
              <Copy size={18} />
            </Button>
          </p>
        </div>
        <div className="pt-3">
          <p className="text-muted-foreground text-sm">Website:</p>
          {isFetchingMetadata ? (
            <div className="h-7 w-[80%] bg-secondary rounded-md animate-pulse" />
          ) : (
            <Link
              href={nft.website}
              className="font-medium text-lg flex items-center gap-2 hover:underline"
              target="_blank"
            >
              {nft.website} <SquareArrowOutUpRight size={18} />
            </Link>
          )}
        </div>
        <div className="relative border-2 border-primary rounded-lg w-fit min-w-[16rem] mt-14 p-4">
          <span className="absolute bg-primary top-0 translate-y-[-50%] px-2 py-1 rounded-md text-primary-foreground text-xs">
            Current Price
          </span>
          <p className="font-bold text-2xl text-primary dark:text-primary-foreground">
            {getEthFromWei(Number(nft.price))} ETH
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-14">
          <Button
            className="text-[1rem] font-medium"
            size={"lg"}
            variant={"default"}
          >
            <ShoppingBag /> Buy
          </Button>
          <Button
            className="text-[1rem] font-medium"
            size={"lg"}
            variant={"secondary"}
            onClick={() => router.back()}
          >
            <ArrowLeftFromLine /> Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewNFT;
