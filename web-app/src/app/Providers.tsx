"use client";

import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";

import { getConfig } from "./wagmi";
import { NftFormData } from "./(root)/(NFT)/nft/create/_components/CreateNftForm";
import { createContext } from "react";
import NextTopLoader, { NextTopLoaderProps } from "nextjs-toploader";

export const PreviewContext = createContext<{
  previewData: NftFormData | undefined;
  setPreviewData: React.Dispatch<React.SetStateAction<NftFormData | undefined>>;
} | null>(null);

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [previewData, setPreviewData] = useState<NftFormData | undefined>();
  const staleTime = 60 * 60 * 1000;
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime } },
      })
  );
  const themeProps: ThemeProviderProps = {
    attribute: "class",
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: true,
  };
  const topLoaderProps: NextTopLoaderProps = {
    color: "#7c3aed",
    height: 3,
    showSpinner: false,
  };
  return (
    <NextThemesProvider {...themeProps}>
      <WagmiProvider config={config} initialState={props.initialState}>
        <QueryClientProvider client={queryClient}>
          <PreviewContext.Provider value={{ previewData, setPreviewData }}>
            <NextTopLoader {...topLoaderProps} />
            {props.children}
          </PreviewContext.Provider>
        </QueryClientProvider>
      </WagmiProvider>
    </NextThemesProvider>
  );
}
