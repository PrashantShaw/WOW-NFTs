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

const useCreateNFT = () => {
  const [isPending, setIsPending] = useState(false);
  const { id: requiredChainId } = getRequiredEthChain();
  const { getItem } = useLocalStorage();
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();
  const { verifyAllChecks } = useDataAccessLayer();

  const createNFT = useCallback(
    async (tokenURI: string, priceInEth: number) => {
      let success = false;

      try {
        verifyAllChecks();
        setIsPending(true);

        const hash = await writeContractAsync({
          address: NFT_CONTRACT_CONFIG.address,
          abi: NFT_CONTRACT_CONFIG.abi,
          functionName: "createToken",
          args: [tokenURI, BigInt(priceInEth)],
          chainId: requiredChainId,
        });
        await waitForTransactionReceipt(getConfig(), {
          hash,
          chainId: requiredChainId,
        });
        const getAllTweetsQueryKey: QueryKey | undefined = getItem(
          LOCALSTORAGE_KEYS.getAllTweetsQueryKey
        );
        queryClient.invalidateQueries({ queryKey: getAllTweetsQueryKey });
        // optionally, u can fetch event which is emitted when tweet is created using 'useWatchContractEvent' hook
        success = true;
        toast.success("Tweet Created!", {
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
