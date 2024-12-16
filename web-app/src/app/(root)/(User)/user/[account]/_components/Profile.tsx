"use client";

import { useUserNFTs } from "@/hooks/useUserNFTs";
import {
  copyToCLipboard,
  decodeText,
  shortedAccountAddress,
} from "@/lib/utils";
import { Copy } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import UserListedNFTs from "./UserListedNFTs";
import UserPurchasedNFTs from "./UserPurchasedNFTs";

const Profile = () => {
  const { address: connectedAddress } = useAccount();
  const params = useParams<{ account: `0x${string}` }>();
  const decodedAddress = decodeText(params.account);
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
  } = useUserNFTs(account);
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

  return (
    <div className="pt-[2.5rem]">
      <h1 className="text-3xl sm:text-5xl font-bold mb-4 flex gap-3 items-end">
        {userAddress}{" "}
        <button
          className="p-2 hover:bg-secondary rounded-md transition-all"
          onClick={() => handleCopyAccountAddress(account ?? "0x")}
        >
          <Copy />
        </button>
      </h1>
      <p className="mb-10 text-lg text-balance">
        Welcome to your Dashboard! Here, you can explore all the NFTs you’ve
        purchased and listed on this marketplace. Feel free to expand your
        collection or showcase your creations by listing more items. Happy
        trading!
      </p>
      <div className="border-t" />
      <h2
        className="text-4xl font-semibold tracking-tight first:mt-0 mb-4 pt-[4rem]"
        id="my-nfts"
      >
        Purchased Items{" "}
        <span className="text-muted-foreground font-normal text-3xl">
          ({userPurchasedNFTs.length})
        </span>
      </h2>
      <p className="mb-4 text-muted-foreground text-balance">
        {isConnectedUser
          ? "Explore your personal NFT collection! This section showcases all the NFTs you own. Manage your assets, relist them for sale, or simply admire your unique collection."
          : "Explore the purchased NFTs collection! This section showcases all the NFTs that this user own. You can simply admire the collection."}
      </p>
      {/* TODO: add purchased nfts here */}
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
        <span className="text-muted-foreground font-normal text-3xl">
          ({userListedNFTs.length})
        </span>
      </h2>
      <p className="mb-4 text-muted-foreground text-balance">
        {isConnectedUser
          ? "Manage all your active NFT listings in one place! This section displays the NFTs you’ve listed for sale on the marketplace. Update details, track engagement, or remove items to refine your selling strategy."
          : "This section displays the NFTs that  is user has listed for sale on the marketplace. Buy or track engagement to refine your own selling strategy."}
      </p>
      {/* TODO: add your listed nfts here */}
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
