import { getRequiredEthChain } from "@/lib/utils";
import { useCallback } from "react";
import { useAccount } from "wagmi";
import useLocalStorage from "./useLocalStorage";
import { LOCALSTORAGE_KEYS } from "@/lib/constants";

export const useDataAccessLayer = () => {
  const { isConnected, chainId: selectedChainId } = useAccount();
  const { id: requiredChainId, name: requiredChainName } =
    getRequiredEthChain();
  const isCorrectChain = selectedChainId === requiredChainId;
  const { getItem } = useLocalStorage();

  /** Throws error if any of the check fails. */
  const verifyAllChecks = useCallback(() => {
    const isRegistered: boolean | null = getItem(
      LOCALSTORAGE_KEYS.isUserRegistered
    );
    if (!isConnected) {
      throw new Error("Wallet not connected!");
    } else if (!isCorrectChain) {
      throw new Error(`Switch chain to ${requiredChainName}`);
    } else if (!isRegistered) {
      throw new Error(`User not Registered!`);
    }
  }, [isConnected, isCorrectChain, requiredChainName, getItem]);

  const verifyConnectionAndChain = useCallback(() => {
    if (!isConnected) {
      throw new Error("Wallet not connected!");
    } else if (!isCorrectChain) {
      throw new Error(`Switch chain to ${requiredChainName}`);
    }
  }, [isConnected, isCorrectChain, requiredChainName]);

  return { verifyAllChecks, verifyConnectionAndChain };
};
