"use client";

import { useUserNFTs } from "@/hooks/useUserNFTs";
import { copyToCLipboard, shortedAccountAddress } from "@/lib/utils";
import { Copy } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

const Profile = () => {
  const { address } = useAccount();
  const params = useParams<{ account: `0x${string}` }>();
  const account = params.account || address;
  const { userListedNFTs, userPurchasedNFTs } = useUserNFTs(account);
  console.log("@@@@@@@@@@@@@@@@@", userListedNFTs, userPurchasedNFTs);
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
  const userAddress = address ? shortedAccountAddress(address) : "OX...";
  return (
    <div className="pt-[2.5rem]">
      <h1 className="text-3xl sm:text-5xl font-bold mb-4 flex gap-3 items-end">
        {userAddress}{" "}
        <button
          className="p-2 hover:bg-secondary rounded-md transition-all"
          onClick={() => handleCopyAccountAddress(address ?? "0x")}
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
        My NFTs
      </h2>
      <p className="mb-4 text-muted-foreground text-balance">
        Explore your personal NFT collection! This section showcases all the
        NFTs you own. Manage your assets, relist them for sale, or simply admire
        your unique collection.
      </p>
      {/* TODO: add purchased nfts here */}
      <h2
        className="text-4xl font-semibold tracking-tight first:mt-0 mb-4 pt-[4rem]"
        id="my-listings"
      >
        My Listings
      </h2>
      <p className="mb-4 text-muted-foreground text-balance">
        Manage all your active NFT listings in one place! This section displays
        the NFTs you’ve listed for sale on the marketplace. Update details,
        track engagement, or remove items to refine your selling strategy.
      </p>
      {/* TODO: add your listed nfts here */}
    </div>
  );
};

export default Profile;
