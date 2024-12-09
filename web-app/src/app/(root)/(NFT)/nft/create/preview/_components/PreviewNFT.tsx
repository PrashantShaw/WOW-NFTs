"use client";

import { usePreviewNFT } from "@/hooks/usePreviewNFT";

const PreviewNFT = () => {
  const previewCtx = usePreviewNFT();
  console.log("preview data :", previewCtx?.previewData);
  return <div>PreviewNFT</div>;
};

export default PreviewNFT;
