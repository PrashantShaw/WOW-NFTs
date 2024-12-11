import React from "react";
import ViewNFT from "../../[id]/_components/ViewNFT";

const page = () => {
  return (
    <div className="pt-[2.5rem]">
      <h1 className="text-5xl font-bold mb-4">NFT Preview</h1>
      <p className="mb-10">
        This is how your NFT will appear on the marketplace once listed. If you
        are happy with your creation then proceed below to create or continue
        editing by clicking back button.
      </p>
      <ViewNFT isPreview={true} id="TEMP_ID" />
    </div>
  );
};

export default page;
