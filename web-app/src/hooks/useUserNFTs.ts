"use client";
import {
  getPinataImageUrl,
  getRequiredEthChain,
  parseNFT,
  splitTokenUri,
} from "@/lib/utils";
import { NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { RawNFT, UnsoldMarketItem } from "@/lib/definitions";
import { useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";

export const useUserNFTs = (
  account: `0x${string}`,
  enabledUserListedNFTs = true,
  enabledUserPurchasedNFTs = true
) => {
  const { address: connectedAccount } = useAccount();
  const {
    data: rawUserListedNFTs,
    isPending: isFetchingListedNFTsByUser,
    error: listedNFTsByUserFetchError,
    queryKey: userListedNFTsQueryKey,
    refetch: fetchListedNFTsByUser,
  } = useReadContract({
    address: NFT_CONTRACT_CONFIG.address,
    abi: NFT_CONTRACT_CONFIG.abi,
    functionName: "fetchListedNFTsByUser",
    chainId: getRequiredEthChain().id,
    query: { enabled: enabledUserListedNFTs, refetchOnWindowFocus: false },
    account: account ?? connectedAccount,
  });
  const {
    data: rawUserPurchasedNFTs,
    isPending: isFetchingPurchasedNFTsByUser,
    error: purchasedNFTsByUserFetchError,
    queryKey: userPurchasedNFTsQueryKey,
    refetch: fetchPurchasedNFTsByUser,
  } = useReadContract({
    address: NFT_CONTRACT_CONFIG.address,
    abi: NFT_CONTRACT_CONFIG.abi,
    functionName: "fetchPurchasedNFTsByUser",
    chainId: getRequiredEthChain().id,
    query: { enabled: enabledUserPurchasedNFTs, refetchOnWindowFocus: false },
    account: account ?? connectedAccount,
  });
  console.log(
    "useUserNFTs hook called",
    rawUserListedNFTs,
    rawUserPurchasedNFTs
  );

  const userListedNFTs = useMemo(() => {
    if (!rawUserListedNFTs) return [];

    const nfts = rawUserListedNFTs.reduce(
      (acc: UnsoldMarketItem[], rawNft: RawNFT) => {
        const { owner, price, seller, sold, tokenId, tokenURI } =
          parseNFT(rawNft);
        const [itemName, category, ipfsHash] = splitTokenUri(tokenURI);

        const imageUrl = getPinataImageUrl(ipfsHash);
        const nftMarketItem = {
          tokenId,
          seller,
          owner,
          price,
          sold,
          imageUrl,
          itemName,
          category,
          ipfsHash,
        };
        acc.push(nftMarketItem);

        return acc;
      },
      []
    );

    return nfts;
  }, [rawUserListedNFTs]);

  const userPurchasedNFTs = useMemo(() => {
    if (!rawUserPurchasedNFTs) return [];

    const nfts = rawUserPurchasedNFTs.reduce(
      (acc: UnsoldMarketItem[], rawNft: RawNFT) => {
        const { owner, price, seller, sold, tokenId, tokenURI } =
          parseNFT(rawNft);
        const [itemName, category, ipfsHash] = splitTokenUri(tokenURI);

        const imageUrl = getPinataImageUrl(ipfsHash);
        const nftMarketItem = {
          tokenId,
          seller,
          owner,
          price,
          sold,
          imageUrl,
          itemName,
          category,
          ipfsHash,
        };
        acc.push(nftMarketItem);

        return acc;
      },
      []
    );

    return nfts;
  }, [rawUserPurchasedNFTs]);

  return {
    userListedNFTs,
    isFetchingListedNFTsByUser: enabledUserListedNFTs
      ? isFetchingListedNFTsByUser
      : false,
    listedNFTsByUserFetchError,
    userListedNFTsQueryKey,
    fetchListedNFTsByUser,
    userPurchasedNFTs,
    isFetchingPurchasedNFTsByUser: enabledUserPurchasedNFTs
      ? isFetchingPurchasedNFTsByUser
      : false,
    purchasedNFTsByUserFetchError,
    userPurchasedNFTsQueryKey,
    fetchPurchasedNFTsByUser,
  };
};
