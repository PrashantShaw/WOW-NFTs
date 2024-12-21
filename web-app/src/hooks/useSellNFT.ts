"use client";
import { NFT_CONTRACT_CONFIG } from "@/lib/constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useReadContract, useWriteContract } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getRequiredEthChain } from "@/lib/utils";
import { waitForTransactionReceipt } from "@wagmi/core";
import { type WriteContractErrorType } from "@wagmi/core";
import { type WaitForTransactionReceiptErrorType } from "@wagmi/core";
import { getConfig } from "@/app/wagmi";
import { useDataAccessLayer } from "./useDataAccessLayer";
import { useGetUnsoldNFTsV2 } from "./useGetUnsoldNFTsV2";

const useSellNFT = () => {
  const [isSellingNFT, setIsSellingNFT] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const { verifyConnectionAndChain } = useDataAccessLayer();
  const { queryKey: unsoldNFTsQueryKey } = useGetUnsoldNFTsV2(false);
  const queryClient = useQueryClient();
  const { id: requiredChainId } = useMemo(() => getRequiredEthChain(), []);

  const {
    data: listingPriceWei,
    isPending: isFetchingListingPrice,
    error: listingPriceFetchError,
  } = useReadContract({
    address: NFT_CONTRACT_CONFIG.address,
    abi: NFT_CONTRACT_CONFIG.abi,
    functionName: "getListingPrice",
    chainId: requiredChainId,
    query: { enabled: true, refetchOnWindowFocus: false },
  });

  useEffect(() => {
    if (listingPriceFetchError) {
      console.log("Error fetching listing price ::", listingPriceFetchError);
      toast.error("Error fetching Listing Price!", {
        duration: 5000,
        position: "bottom-right",
      });
    }
  }, [listingPriceFetchError]);

  const sellNFT = useCallback(
    async (tokenId: string, sellPriceWei: string) => {
      let success = false;

      try {
        verifyConnectionAndChain();
        setIsSellingNFT(true);

        if (!listingPriceWei) {
          throw new Error("Listing Price not available!");
        }

        const hash = await writeContractAsync({
          address: NFT_CONTRACT_CONFIG.address,
          abi: NFT_CONTRACT_CONFIG.abi,
          functionName: "resellToken",
          args: [BigInt(tokenId), BigInt(sellPriceWei)],
          chainId: requiredChainId,
          value: listingPriceWei,
        });
        await waitForTransactionReceipt(getConfig(), {
          hash,
          chainId: requiredChainId,
        });

        queryClient.invalidateQueries({ queryKey: unsoldNFTsQueryKey });
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
        setIsSellingNFT(false);
      }

      return { success };
    },
    [
      verifyConnectionAndChain,
      writeContractAsync,
      requiredChainId,
      listingPriceWei,
      queryClient,
      unsoldNFTsQueryKey,
    ]
  );

  return {
    isSellingNFT,
    isFetchingListingPrice,
    sellNFT,
  };
};

export default useSellNFT;
