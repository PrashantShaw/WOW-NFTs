"use client";
import { NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { useCallback, useState } from "react";
import { useWriteContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getRequiredEthChain } from "@/lib/utils";
import { waitForTransactionReceipt } from "@wagmi/core";
import { type WriteContractErrorType } from "@wagmi/core";
import { type WaitForTransactionReceiptErrorType } from "@wagmi/core";
import { getConfig } from "@/app/wagmi";
import { useDataAccessLayer } from "./useDataAccessLayer";
import { useGetUnsoldNFTsV2 } from "./useGetUnsoldNFTsV2";
import { useGetNFT } from "./useGetNFT";

const useBuyNFT = () => {
  const [isBuyingNFT, setIsBuyingNFT] = useState(false);
  const { id: requiredChainId } = getRequiredEthChain();
  const queryClient = useQueryClient();
  const { writeContractAsync } = useWriteContract();
  const { verifyConnectionAndChain } = useDataAccessLayer();
  const { queryKey: unsoldNFTsQueryKey } = useGetUnsoldNFTsV2(false);
  const { invalidateQuery: invalidateGetNFT } = useGetNFT("0", false);

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

        queryClient.invalidateQueries({ queryKey: unsoldNFTsQueryKey });
        invalidateGetNFT(tokenId);
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
      queryClient,
      unsoldNFTsQueryKey,
      invalidateGetNFT,
    ]
  );

  return {
    isBuyingNFT,
    buyNFT,
  };
};

export default useBuyNFT;
