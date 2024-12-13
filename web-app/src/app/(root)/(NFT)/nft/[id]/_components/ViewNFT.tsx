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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import NextImg from "next/image";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import {
  copyToCLipboard,
  getEthFromWei,
  getEthPriceUsd,
  getWeiFromEth,
  shortedAccountAddress,
  textCapitalize,
} from "@/lib/utils";
import Link from "next/link";
import {
  ArrowLeftFromLine,
  Copy,
  Ellipsis,
  EqualApproximately,
  Eye,
  Flag,
  LoaderCircle,
  Pencil,
  RefreshCcw,
  Share2,
  ShoppingBag,
  SquareArrowOutUpRight,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import useCreateNFT from "@/hooks/useCreateNFT";

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
    if (isPreview && !previewCtx?.previewData) router.replace("/nft/create");
  })();

  const [isNftImageLoading, setIsNftImageLoading] = useState(true);
  const { address } = useAccount();
  const { unsoldNFTs, isPending, unsoldNFTsFetchError } = useGetUnsoldNFTsV2(
    unsoldNFTsFetchEnabled
  );
  const {
    createNFT,
    isCreatingNFT,
    listingPriceWei,
    isFetchingListingPrice,
    listingPriceFetchError,
  } = useCreateNFT();

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

  useEffect(() => {
    if (listingPriceFetchError) {
      console.log("Error fetching listing price ::", listingPriceFetchError);
      toast.error("Error fetching Listing Price!", {
        duration: 5000,
        position: "bottom-right",
      });
    }
  }, [listingPriceFetchError]);

  const nftMetadata = useMemo(
    () =>
      pinataFileMetadata
        ? (pinataFileMetadata.filesMeta[0].metadata
            .keyvalues as PinataFileMetadata)
        : ({} as PinataFileMetadata),
    [pinataFileMetadata]
  );

  const nft: NFTMarketItem = useMemo(() => {
    if (isPreview && previewCtx?.previewData) {
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
        price: getWeiFromEth(price).toString(),
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

  const ONE_ETH_PRICE_USD = useMemo(() => getEthPriceUsd(), []);

  const handleShareNft = useCallback(async () => {
    const nftShareLink = window.location.href;
    const copid = await copyToCLipboard(nftShareLink);
    if (copid) {
      toast.success("Share link copied to clipboard!", {
        position: "bottom-right",
      });
    } else {
      toast.error("Failed copy share link to clipboard!", {
        position: "bottom-right",
      });
    }
  }, []);

  const handleCopySellerAddress = useCallback(async () => {
    const sellerAddress = nft.seller;
    const copid = await copyToCLipboard(sellerAddress);
    if (copid) {
      toast.success("Seller's Address Copied!", {
        position: "bottom-right",
      });
    } else {
      toast.error("Failed copy seller's address!", {
        position: "bottom-right",
      });
    }
  }, [nft.seller]);

  const handleBackToCreateNftForm = useCallback(async () => {
    router.push("/nft/create?from-preview=true");
  }, [router]);

  const handleCreateNFT = useCallback(async () => {
    if (!isPreview || !previewCtx?.previewData) return;

    const formData = previewCtx?.previewData;
    const listingPriceEth = getEthFromWei(Number(listingPriceWei));
    try {
      const result = await createNFT({ ...formData, listingPriceEth });
      if (result.success) {
        router.replace("/nft/collections");
      }
    } catch (error: unknown | Error) {
      console.log("Error creating nft!", error);
      toast.error("Failed to create NFT!", {
        duration: 5000,
        position: "bottom-right",
      });
    }
  }, [createNFT, isPreview, listingPriceWei, previewCtx?.previewData, router]);

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem]">
      <div className="">
        {isNftImageLoading ? (
          <div className="grid place-content-center bg-muted aspect-[3/4] rounded-md animate-pulse">
            <NextImg
              src={"/image-placeholder.png"}
              alt="NFT Image Placeholder"
              width={768}
              height={768}
              className=" w-full dark:opacity-10 opacity-50"
            />
          </div>
        ) : null}
        <Dialog>
          <DialogTrigger>
            <div className="relative z-20 group/nft-img">
              <div className="absolute inset-0 hover:bg-black/10 transition-all rounded-xl" />
              <Eye className="absolute top-5 right-5 z-20 opacity-50 transition-all group-hover/nft-img:opacity-100" />
              <NextImg
                src={nft.imageUrl}
                alt="NFT image"
                width={768}
                height={768}
                className={clsx(
                  "rounded-xl z-10",
                  isNftImageLoading ? "opacity-0 h-0" : "opacity-100 h-full"
                )}
                onLoad={() => setIsNftImageLoading(false)}
                onError={() => setIsNftImageLoading(false)}
              />
            </div>
          </DialogTrigger>
          <DialogContent className="border-0 md:w-fit max-w-[95%] p-0 bg-transparent shadow-none">
            <div className="flex w-full h-fit max-h-screen ">
              <NextImg
                src={nft.imageUrl}
                alt="NFT image"
                width={1768}
                height={1768}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="">
        <div className="flex items-center justify-between gap-2 pb-6">
          <Badge variant="default" className="text-lg">
            {textCapitalize(nft.category)}
          </Badge>
          <div className="flex items-center gap-0">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={handleShareNft}
                  >
                    <Share2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant={"ghost"} size={"icon"}>
                        <Ellipsis />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>More</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => router.refresh()}>
                  <RefreshCcw />
                  Refresh Metadata
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={handleCopySellerAddress}
            >
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
              className="font-medium text-lg flex items-center gap-2 hover:underline w-fit"
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
          <p className="font-bold text-2xl text-primary dark:text-primary-foreground flex items-center gap-3">
            {getEthFromWei(Number(nft.price))} ETH{" "}
            <span className="text-lg text-muted-foreground flex items-center gap-1 font-normal">
              <EqualApproximately size={18} /> $
              {(ONE_ETH_PRICE_USD * getEthFromWei(Number(nft.price))).toFixed(
                2
              )}
            </span>
          </p>
        </div>
        <div className="pt-1">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            1 ETH <EqualApproximately size={14} /> ${ONE_ETH_PRICE_USD}
          </p>
        </div>
        {isPreview ? (
          <div className="grid grid-cols-2 gap-3 pt-14">
            <Button
              className="text-[1rem] font-medium"
              size={"lg"}
              variant={"default"}
              onClick={handleCreateNFT}
              disabled={isCreatingNFT || isFetchingListingPrice}
            >
              {isCreatingNFT ? (
                <>
                  <LoaderCircle className="animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Upload /> Create
                </>
              )}
            </Button>
            <Button
              className="text-[1rem] font-medium"
              size={"lg"}
              variant={"secondary"}
              onClick={handleBackToCreateNftForm}
            >
              <Pencil /> Edit
            </Button>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ViewNFT;
