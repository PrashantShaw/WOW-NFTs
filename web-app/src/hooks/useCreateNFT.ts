"use client";
import { LOCALSTORAGE_KEYS, NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { useCallback, useState } from "react";
import { useWriteContract } from "wagmi";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getRequiredEthChain, getWeiFromEth } from "@/lib/utils";
import { waitForTransactionReceipt } from "@wagmi/core";
import { type WriteContractErrorType } from "@wagmi/core";
import { type WaitForTransactionReceiptErrorType } from "@wagmi/core";
import { getConfig } from "@/app/wagmi";
import useLocalStorage from "./useLocalStorage";
import { useDataAccessLayer } from "./useDataAccessLayer";
import { NftFormData } from "@/app/(root)/(NFT)/nft/create/_components/CreateNftForm";
import { NFTFileUploadResponseData } from "@/lib/definitions";

type CreateNFTFormData = {
  listingPriceEth: number;
} & NftFormData;
const useCreateNFT = () => {
  const [isPending, setIsPending] = useState(false);
  const { id: requiredChainId } = getRequiredEthChain();
  const { getItem } = useLocalStorage();
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();
  const { verifyConnectionAndChain } = useDataAccessLayer();

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
        setIsPending(true);

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
        const { ipfsHash, isDuplicate }: NFTFileUploadResponseData =
          await uploadRequest.json();
        console.log("Upload data :", ipfsHash, isDuplicate);

        const priceInWei = getWeiFromEth(priceInEth);
        const listingPriceInWei = getWeiFromEth(listingPriceEth);

        const hash = await writeContractAsync({
          address: NFT_CONTRACT_CONFIG.address,
          abi: NFT_CONTRACT_CONFIG.abi,
          functionName: "createToken",
          args: [ipfsHash, BigInt(priceInWei)],
          chainId: requiredChainId,
          value: BigInt(listingPriceInWei),
        });
        await waitForTransactionReceipt(getConfig(), {
          hash,
          chainId: requiredChainId,
        });

        const getUnsoldNFTsQueryKey: QueryKey | undefined = getItem(
          LOCALSTORAGE_KEYS.getUnsoldNFTs
        );
        queryClient.invalidateQueries({ queryKey: getUnsoldNFTsQueryKey });
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
        setIsPending(false);
      }

      return { success };
    },
    [
      verifyConnectionAndChain,
      writeContractAsync,
      requiredChainId,
      getItem,
      queryClient,
    ]
  );

  return {
    isPending,
    createNFT,
  };
};

export default useCreateNFT;
