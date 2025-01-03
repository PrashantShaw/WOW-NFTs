import React from "react";
import { CreateNftForm } from "./_components/CreateNftForm";

// TODO: visit - https://www.youtube.com/watch?v=XTb-34rcuN4&t=20892s
const CreateNFTPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const fromPreview = searchParams["from-preview"] === "true" ? true : false;
  return (
    <div className="pt-[2.5rem] animate-fade-in">
      <h1 className="text-5xl font-bold mb-4">Create New Item</h1>
      <p className="mb-10">
        You can set preferred display name, create your profile URL and manage
        other personal settings.
      </p>
      <div className="pt-10 border-t">
        <CreateNftForm fromPreview={fromPreview} />
      </div>
    </div>
  );
};

export default CreateNFTPage;
