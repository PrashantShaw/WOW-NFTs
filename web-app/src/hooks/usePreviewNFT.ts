"use client";

import { PreviewContext } from "@/app/Providers";
import { useContext } from "react";

export const usePreviewNFT = () => {
  return useContext(PreviewContext);
};
