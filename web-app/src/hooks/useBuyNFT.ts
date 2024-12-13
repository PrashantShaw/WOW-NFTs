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

const useBuyNFT = () => {
  const [isBuyingNFT, setIsBuyingNFT] = useState(false);
  const { id: requiredChainId } = getRequiredEthChain();
  const { getItem } = useLocalStorage();
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();
  const { verifyConnectionAndChain } = useDataAccessLayer();

  const buyNFT = useCallback(
    async (tokenId: string, priceWei: string) => {
      let success = false;

      try {
        verifyConnectionAndChain();
        setIsBuyingNFT(true);

        const hash = await writeContractAsync({
          address: NFT_CONTRACT_CONFIG.address,
          abi: NFT_CONTRACT_CONFIG.abi,
          functionName: "buyToken",
          args: [BigInt(tokenId)],
          chainId: requiredChainId,
          value: BigInt(priceWei),
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
        toast.success("NFT Purchased!", {
          position: "bottom-center",
          duration: 3000,
        });
      } catch (error: unknown) {
        const typedError = error as
          | WriteContractErrorType
          | WaitForTransactionReceiptErrorType
          | Error;
        const shortErrorMessage = typedError.message.split("\n")[0];
        console.log("error purchasing nft ::", typedError);
        toast.error(shortErrorMessage, {
          position: "bottom-right",
          duration: 5000,
        });
      } finally {
        setIsBuyingNFT(false);
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
    isBuyingNFT,
    buyNFT,
  };
};

export default useBuyNFT;
