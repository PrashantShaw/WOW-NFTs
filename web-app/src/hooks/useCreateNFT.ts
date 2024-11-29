"use client";
import { LOCALSTORAGE_KEYS, NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { useCallback, useState } from "react";
import { useWriteContract } from "wagmi";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getRequiredEthChain } from "@/lib/utils";
import { waitForTransactionReceipt } from "@wagmi/core";
import { type WriteContractErrorType } from "@wagmi/core";
import { type WaitForTransactionReceiptErrorType } from "@wagmi/core";
import { getConfig } from "@/app/wagmi";
import useLocalStorage from "./useLocalStorage";
import { useDataAccessLayer } from "./useDataAccessLayer";
import { NftFormData } from "@/app/(root)/(NFT)/nft/create/_components/CreateNftForm";
import { NFTFileUploadResponseData } from "@/lib/definitions";

const useCreateNFT = () => {
  const [isPending, setIsPending] = useState(false);
  const { id: requiredChainId } = getRequiredEthChain();
  const { getItem } = useLocalStorage();
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();
  const { verifyAllChecks } = useDataAccessLayer();

  const createNFT = useCallback(
    async (nftFormData: NftFormData) => {
      let success = false;
      const {
        nftImage,
        price: priceInEth,
        itemName,
        description,
        website,
        category,
      } = nftFormData;

      try {
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
        const data: NFTFileUploadResponseData = await uploadRequest.json();
        console.log("Upload data :", data);

        verifyAllChecks();
        setIsPending(true);

        const hash = await writeContractAsync({
          address: NFT_CONTRACT_CONFIG.address,
          abi: NFT_CONTRACT_CONFIG.abi,
          functionName: "createToken",
          args: [data.IpfsHash, BigInt(priceInEth)],
          chainId: requiredChainId,
        });
        await waitForTransactionReceipt(getConfig(), {
          hash,
          chainId: requiredChainId,
        });
        const getUnsoldNFTsQueryKey: QueryKey | undefined = getItem(
          LOCALSTORAGE_KEYS.getUnsoldNFTs
        );
        queryClient.invalidateQueries({ queryKey: getUnsoldNFTsQueryKey });
        // optionally, u can fetch event which is emitted when tweet is created using 'useWatchContractEvent' hook
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
        toast.error(shortErrorMessage, {
          position: "bottom-right",
          duration: 5000,
        });
      } finally {
        setIsPending(false);
      }

      return { success };
    },
    [verifyAllChecks, writeContractAsync, requiredChainId, getItem, queryClient]
  );

  return {
    isPending,
    createNFT,
  };
};

export default useCreateNFT;
