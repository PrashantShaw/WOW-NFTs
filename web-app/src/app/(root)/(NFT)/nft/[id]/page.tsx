import React from "react";
import ViewNFT from "./_components/ViewNFT";

const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>
      <ViewNFT id={params.id} isPreview={false} />
    </div>
  );
};

export default page;
