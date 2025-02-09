"use client";

import { usePreviewNFT } from "@/hooks/usePreviewNFT";
import { NFTMarketItem } from "@/lib/definitions";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
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
  CircleDollarSign,
  CircleX,
  CookingPot,
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
import useCreateNFT from "@/hooks/useCreateNFT";
import useBuyNFT from "@/hooks/useBuyNFT";
import { useGetNFTMarketItem } from "@/hooks/useGetNFTMarketItem";
import { useAccount } from "wagmi";
import useSellNFT from "@/hooks/useSellNFT";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type ViewNFTProps = {
  id: string;
  isPreview?: boolean;
};
// TODO: create buy/sell btn based on seller fo the item
const ViewNFT = ({ id, isPreview = false }: ViewNFTProps) => {
  const previewCtx = usePreviewNFT();
  const router = useRouter();

  useEffect(() => {
    if (isPreview && !previewCtx?.previewData) router.replace("/nft/create");
  }, [isPreview, previewCtx?.previewData, router]);

  const {
    nft,
    isFetchingNFT,
    isFetchingMetadata,
    NFTFetchError,
    pinataMetadataError,
  } = useGetNFTMarketItem(id, isPreview);

  if (isFetchingNFT)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 py-[4rem]">
        {/* TODO: add skeletons here */}
        skeletons here...
      </div>
    );

  if (NFTFetchError || pinataMetadataError)
    return (
      <div className="text-center text-red-500 font-semibold pt-10">
        {NFTFetchError?.shortMessage}
        {pinataMetadataError?.message}
      </div>
    );

  if (Object.keys(nft).length === 0)
    return (
      <div className="grid place-items-center gap-4 text-muted-foreground bg-muted pt-24 pb-28 rounded-lg">
        <CookingPot className="w-[5rem] h-[5rem]" strokeWidth={1} />
        <p className="text-center font-medium text-3xl ">NFT Not Found!</p>
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[4rem]">
      <NFTImage imageUrl={nft.imageUrl} />
      <NFTDetails
        nft={nft}
        isFetchingMetadata={isFetchingMetadata}
        isPreview={isPreview}
      />
    </div>
  );
};

type NFTImageProps = {
  imageUrl: string;
};
const NFTImage = ({ imageUrl }: NFTImageProps) => {
  const [isNftImageLoading, setIsNftImageLoading] = useState(true);

  return (
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
              src={imageUrl}
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
              src={imageUrl}
              alt="NFT image"
              width={1768}
              height={1768}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

type NFTDetailsProps = {
  nft: NFTMarketItem;
  isFetchingMetadata: boolean;
  isPreview: boolean;
};
const NFTDetails = ({
  nft,
  isFetchingMetadata,
  isPreview,
}: NFTDetailsProps) => {
  const router = useRouter();
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

  return (
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
      <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="">
          <p className="text-muted-foreground text-sm">Seller:</p>
          <p className="font-medium text-lg flex items-center gap-1">
            {shortedAccountAddress(nft.seller)}{" "}
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => handleCopyAccountAddress(nft.seller)}
            >
              <Copy size={18} />
            </Button>
          </p>
        </div>
        <div className="">
          <p className="text-muted-foreground text-sm">Owner:</p>
          <p className="font-medium text-lg flex items-center gap-1">
            {shortedAccountAddress(nft.owner)}{" "}
            <Button
              size={"icon"}
              variant={"ghost"}
              onClick={() => handleCopyAccountAddress(nft.owner)}
            >
              <Copy size={18} />
            </Button>
          </p>
        </div>
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
            {(ONE_ETH_PRICE_USD * getEthFromWei(Number(nft.price))).toFixed(2)}
          </span>
        </p>
      </div>
      <div className="pt-1">
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          1 ETH <EqualApproximately size={14} /> ${ONE_ETH_PRICE_USD}
        </p>
      </div>
      {/* action buttons */}
      <ActionButtons
        isPreview={isPreview}
        owner={nft.owner}
        priceWei={nft.price}
        sold={nft.sold}
        tokenId={nft.tokenId}
      />
    </div>
  );
};

const ActionButtons = ({
  isPreview,
  tokenId,
  priceWei,
  sold,
  owner,
}: {
  isPreview: boolean;
  tokenId: string;
  priceWei: string;
  sold: boolean;
  owner: `0x${string}`;
}) => {
  const router = useRouter();
  const { address } = useAccount();
  const isOwner = sold && owner === address;

  const handleBackToCreateNftForm = useCallback(async () => {
    router.push("/nft/create?from-preview=true");
  }, [router]);
  return (
    <>
      {isPreview ? (
        <div className="grid grid-cols-2 gap-3 pt-14">
          {/* create button */}
          <CreateButton isPreview={isPreview} />
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
        // TODO: add selling button when user owns the nft
        <div className="grid grid-cols-2 gap-3 pt-14">
          {isOwner ? (
            <SellButton tokenId={tokenId} />
          ) : (
            <BuyButton
              isPreview={isPreview}
              tokenId={tokenId}
              priceWei={priceWei}
            />
          )}
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
    </>
  );
};

const CreateButton = ({ isPreview }: { isPreview: boolean }) => {
  const previewCtx = usePreviewNFT();
  const {
    createNFT,
    isCreatingNFT,
    listingPriceWei,
    isFetchingListingPrice,
    listingPriceFetchError,
  } = useCreateNFT();
  const router = useRouter();

  useEffect(() => {
    if (listingPriceFetchError) {
      console.log("Error fetching listing price ::", listingPriceFetchError);
      toast.error("Error fetching Listing Price!", {
        duration: 5000,
        position: "bottom-right",
      });
    }
  }, [listingPriceFetchError]);

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

  return (
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
  );
};

const BuyButton = ({
  isPreview,
  tokenId,
  priceWei,
}: {
  isPreview: boolean;
  tokenId: string;
  priceWei: string;
}) => {
  const { buyNFT, isBuyingNFT } = useBuyNFT();
  const router = useRouter();

  const handleBuyNFT = useCallback(async () => {
    if (isPreview) return;

    try {
      const result = await buyNFT(tokenId, priceWei);
      if (result.success) {
        router.replace("/nft/collections");
      }
    } catch (error) {
      console.log("Error Buying nft!", error);
      toast.error("Failed to Buy NFT!", {
        duration: 5000,
        position: "bottom-right",
      });
    }
  }, [buyNFT, isPreview, priceWei, tokenId, router]);
  return (
    <Button
      className="text-[1rem] font-medium"
      size={"lg"}
      variant={"default"}
      onClick={handleBuyNFT}
      disabled={isBuyingNFT}
    >
      {isBuyingNFT ? (
        <>
          <LoaderCircle className="animate-spin" />
        </>
      ) : (
        <>
          <ShoppingBag /> Buy
        </>
      )}
    </Button>
  );
};
const SellButton = ({ tokenId }: { tokenId: string }) => {
  const { sellNFT, listingPriceWei, isFetchingListingPrice, isSellingNFT } =
    useSellNFT();
  const router = useRouter();
  const [newPrice, setNewPrice] = useState<string>();
  const [error, setError] = useState<string | null>(null);

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
        <Button
          className="text-[1rem] font-medium"
          size={"lg"}
          variant={"default"}
          onClick={handleSellToken}
          disabled={isSellingNFT || isFetchingListingPrice}
        >
          {isSellingNFT ? (
            <>
              <LoaderCircle className="animate-spin" />
            </>
          ) : (
            <>
              <CircleDollarSign /> Sell
            </>
          )}
        </Button>
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

export default ViewNFT;
