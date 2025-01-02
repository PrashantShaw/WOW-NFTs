"use client";

import { useUserNFTs } from "@/hooks/useUserNFTs";
import {
  copyToCLipboard,
  decodeText,
  getProfileGradientStyle,
  shortedAccountAddress,
  validateAccountAddress,
} from "@/lib/utils";
import { Copy, Loader, RefreshCcw, ShieldX } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import UserListedNFTs from "./UserListedNFTs";
import UserPurchasedNFTs from "./UserPurchasedNFTs";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Profile = () => {
  const { address: connectedAddress } = useAccount();
  const params = useParams<{ account: `0x${string}` }>();
  const decodedAddress = decodeText(params.account);
  const isValidAddress = validateAccountAddress(decodedAddress);
  const isConnectedUser = decodedAddress === connectedAddress;
  const account = isConnectedUser
    ? connectedAddress
    : (decodedAddress as `0x${string}`);
  const {
    userListedNFTs,
    isFetchingListedNFTsByUser,
    listedNFTsByUserFetchError,
    userPurchasedNFTs,
    isFetchingPurchasedNFTsByUser,
    purchasedNFTsByUserFetchError,
    fetchPurchasedNFTsByUser,
    fetchListedNFTsByUser,
  } = useUserNFTs(account, isValidAddress, isValidAddress);
  // console.log("@@@@@@@@@@@@@@@@@", userListedNFTs, userPurchasedNFTs);

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

  const userAddress = account ? shortedAccountAddress(account) : "OX...";
  const profileGradientStyle = useMemo(
    () => getProfileGradientStyle(account),
    [account]
  );

  if (!isValidAddress) {
    return (
      <div className="bg-muted rounded-lg mt-[2.5rem] px-6 py-[8rem] flex flex-col items-center justify-center gap-3">
        <ShieldX className="text-red-500 w-16 h-16" strokeWidth={1} />
        <h3 className="text-red-500 text-xl font-medium">
          Invalid Account Adress!
        </h3>
      </div>
    );
  }

  return (
    <div className="pt-[2.5rem]">
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div
          className=" w-[4rem] h-[4rem] border rounded-md"
          style={profileGradientStyle}
        />
        <h1 className="text-3xl sm:text-5xl font-bold  flex gap-3 items-end">
          {userAddress}{" "}
          <button
            className="p-2 hover:bg-secondary rounded-md transition-all"
            onClick={() => handleCopyAccountAddress(account ?? "0x")}
          >
            <Copy />
          </button>
        </h1>
      </div>
      <p className="mb-10 text-lg text-balance">
        {isConnectedUser
          ? "Welcome to your Dashboard! Here, you can explore all the NFTs you’ve purchased and listed on this marketplace. Feel free to expand your collection or showcase your creations by listing more items. Happy trading!"
          : "Welcome to my Dashboard! Here, you can explore all the NFTs that I purchased and listed on this marketplace. Feel free explore my collection or showcase your creations by listing more items, just like I did. Happy trading!"}
      </p>
      <div className="border-t" />
      <h2
        className="text-4xl font-semibold tracking-tight first:mt-0 mb-4 pt-[4rem]"
        id="my-nfts"
      >
        Purchased Items{" "}
        <span className="text-muted-foreground font-normal text-3xl pr-4">
          ({userPurchasedNFTs.length})
        </span>
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant={"secondary"}
                size={"icon"}
                onClick={() => {
                  fetchPurchasedNFTsByUser();
                }}
                disabled={isFetchingPurchasedNFTsByUser}
              >
                {isFetchingPurchasedNFTsByUser ? (
                  <Loader className="animate-spin" />
                ) : (
                  <RefreshCcw />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-normal">Refresh</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h2>
      <p className="mb-4 text-muted-foreground text-balance">
        {isConnectedUser
          ? "Explore your personal NFT collection! This section showcases all the NFTs you own. Manage your assets, relist them for sale, or simply admire your unique collection."
          : "Explore the purchased NFTs collection! This section showcases all the NFTs that this user own. You can simply admire the collection."}
      </p>
      <UserPurchasedNFTs
        userPurchasedNFTs={userPurchasedNFTs}
        isPending={isFetchingPurchasedNFTsByUser}
        error={purchasedNFTsByUserFetchError}
        isConnectedUser={isConnectedUser}
      />
      <h2
        className="text-4xl font-semibold tracking-tight first:mt-0 mb-4 pt-[4rem]"
        id="my-listings"
      >
        Listed Items{" "}
        <span className="text-muted-foreground font-normal text-3xl pr-4">
          ({userListedNFTs.length})
        </span>
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button
                variant={"secondary"}
                size={"icon"}
                onClick={() => {
                  fetchListedNFTsByUser();
                }}
                disabled={isFetchingListedNFTsByUser}
              >
                {isFetchingListedNFTsByUser ? (
                  <Loader className="animate-spin" />
                ) : (
                  <RefreshCcw />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-normal">Refresh</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h2>
      <p className="mb-4 text-muted-foreground text-balance">
        {isConnectedUser
          ? "Manage all your active NFT listings in one place! This section displays the NFTs you’ve listed for sale on the marketplace. Update details, track engagement, or remove items to refine your selling strategy."
          : "This section displays the NFTs that  is user has listed for sale on the marketplace. Buy or track engagement to refine your own selling strategy."}
      </p>
      <UserListedNFTs
        userListedNFTs={userListedNFTs}
        isPending={isFetchingListedNFTsByUser}
        error={listedNFTsByUserFetchError}
        isConnectedUser={isConnectedUser}
      />
    </div>
  );
};

export default Profile;
