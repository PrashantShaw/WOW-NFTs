"use client";
import { NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { useCallback, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  createTokenUri,
  getRequiredEthChain,
  getWeiFromEth,
} from "@/lib/utils";
import { waitForTransactionReceipt } from "@wagmi/core";
import { type WriteContractErrorType } from "@wagmi/core";
import { type WaitForTransactionReceiptErrorType } from "@wagmi/core";
import { getConfig } from "@/app/wagmi";
import { useDataAccessLayer } from "./useDataAccessLayer";
import { NftFormData } from "@/app/(root)/(NFT)/nft/create/_components/CreateNftForm";
import { NFTFileUploadResponseData } from "@/lib/definitions";
import { useGetUnsoldNFTsV2 } from "./useGetUnsoldNFTsV2";

type CreateNFTFormData = {
  listingPriceEth: number;
} & NftFormData;
const useCreateNFT = () => {
  const [isCreatingNFT, setIsCreatingNFT] = useState(false);
  const { id: requiredChainId } = getRequiredEthChain();
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();
  const {
    data: listingPriceWei,
    isPending: isFetchingListingPrice,
    error: listingPriceFetchError,
  } = useReadContract({
    address: NFT_CONTRACT_CONFIG.address,
    abi: NFT_CONTRACT_CONFIG.abi,
    functionName: "getListingPrice",
    chainId: getRequiredEthChain().id,
    query: { enabled: true, refetchOnWindowFocus: false },
  });
  const { verifyConnectionAndChain } = useDataAccessLayer();
  const { queryKey: unsoldNFTsQueryKey } = useGetUnsoldNFTsV2(false);

  const createNFT = useCallback(
    async (nftFormData: CreateNFTFormData) => {
      let success = false;
      const {
        nftImage,
        price: priceInEth,
        itemName,
        description,
        website,
        category,
        listingPriceEth,
      } = nftFormData;

      try {
        verifyConnectionAndChain();
        setIsCreatingNFT(true);

        const formDataBody = new FormData();
        formDataBody.append("nftImage", nftImage[0]);
        formDataBody.append("itemName", itemName);
        formDataBody.append("description", description);
        formDataBody.append("website", website);
        formDataBody.append("category", category);

        const uploadRequest = await fetch("/api/nft-file", {
          method: "POST",
          body: formDataBody,
        });
        const { ipfsHash }: NFTFileUploadResponseData =
          await uploadRequest.json();

        const priceInWei = getWeiFromEth(priceInEth);
        const listingPriceInWei = getWeiFromEth(listingPriceEth);
        const tokenUri = createTokenUri(itemName, category, ipfsHash);

        const hash = await writeContractAsync({
          address: NFT_CONTRACT_CONFIG.address,
          abi: NFT_CONTRACT_CONFIG.abi,
          functionName: "createToken",
          args: [tokenUri, BigInt(priceInWei)],
          chainId: requiredChainId,
          value: BigInt(listingPriceInWei),
        });
        await waitForTransactionReceipt(getConfig(), {
          hash,
          chainId: requiredChainId,
        });

        queryClient.invalidateQueries({ queryKey: unsoldNFTsQueryKey });
        success = true;
        toast.success("NFT Created!", {
          position: "bottom-center",
          duration: 3000,
        });
      } catch (error: unknown) {
        const typedError = error as
          | WriteContractErrorType
          | WaitForTransactionReceiptErrorType
          | Error;
        const shortErrorMessage = typedError.message.split("\n")[0];
        console.log("error creating nft ::", typedError);
        toast.error(shortErrorMessage, {
          position: "bottom-right",
          duration: 5000,
        });
      } finally {
        setIsCreatingNFT(false);
      }

      return { success };
    },
    [
      verifyConnectionAndChain,
      writeContractAsync,
      requiredChainId,
      queryClient,
      unsoldNFTsQueryKey,
    ]
  );

  return {
    isCreatingNFT,
    createNFT,
    listingPriceWei,
    isFetchingListingPrice,
    listingPriceFetchError,
  };
};

export default useCreateNFT;
