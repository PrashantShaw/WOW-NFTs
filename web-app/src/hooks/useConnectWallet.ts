"use client";

import { getRequiredEthChain, shortedAccountAddress } from "@/lib/utils";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { Connector, CreateConnectorFn, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

const useConnectWallet = (
  connector: CreateConnectorFn | Connector = injected()
) => {
  const { connectAsync } = useConnect();

  const connectToWallet = useCallback(() => {
    (async () => {
      try {
        const { accounts } = await connectAsync({
          connector,
          chainId: getRequiredEthChain().id, // this will ask the user to switch the chain after wallet is connected
        });
        const connectedAccount = accounts[0];
        toast.success(
          `Account ${shortedAccountAddress(connectedAccount)} Connected!`,
          {
            position: "bottom-right",
            duration: 3000,
          }
        );
      } catch (error: Error | unknown) {
        const shortErrorMessage = (error as Error).message.split("\n")[0];
        toast.error(shortErrorMessage, {
          position: "bottom-right",
          duration: 5000,
        });
      }
    })().catch((error: Error | unknown) => console.error(error));
  }, [connectAsync, connector]);
  return { connectToWallet };
};

export default useConnectWallet;
