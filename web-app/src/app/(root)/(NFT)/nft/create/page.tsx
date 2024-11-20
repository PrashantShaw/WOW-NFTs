import React from "react";
import { CreateNftForm } from "./_components/CreateNftForm";

// TODO: visit - https://www.youtube.com/watch?v=XTb-34rcuN4&t=7924s | implement react-dropzone
const CreateNFTPage = () => {
  return (
    <div className="pt-[2.5rem]">
      <h1 className="text-5xl font-bold mb-4">Create New Item</h1>
      <p className="mb-10">
        You can set preferred display name, create your profile URL and manage
        other personal settings.
      </p>
      <CreateNftForm />
    </div>
  );
};

export default CreateNFTPage;
