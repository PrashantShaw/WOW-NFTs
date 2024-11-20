/* eslint-disable @next/next/no-img-element */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BadgePlus } from "lucide-react";
import React, { useRef } from "react";
import { useDropzone } from "react-dropzone";

function Dropzone(props: { required: boolean; name: string }) {
  const { required, name } = props;

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const previewImageRef = useRef<HTMLImageElement | null>(null);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: (incomingFiles) => {
      if (hiddenInputRef.current) {
        // Note the specific way we need to munge the file into the hidden input//-
        // https://stackoverflow.com/a/68182158/1068446//-
        const dataTransfer = new DataTransfer();
        incomingFiles.forEach((v) => {
          dataTransfer.items.add(v);
        });
        hiddenInputRef.current.files = dataTransfer.files;
      }
    },
  });

  const selectedFiles = acceptedFiles.map((file) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const binaryStr = reader.result;
      if (previewImageRef.current) {
        previewImageRef.current.src = binaryStr as string;
      }
    };
    reader.readAsDataURL(file);
    return (
      <div
        key={file.path}
        className="flex flex-col items-center justify-center gap-3"
      >
        <p className="text-center text-muted-foreground">
          {file.name} - {file.size.toLocaleString()} bytes - {file.type}
        </p>
        <img ref={previewImageRef} src="/" alt="selected Image" />
      </div>
    );
  });

  return (
    <div className="">
      <div
        className="rounded-lg border-dashed border-4 p-10 cursor-pointer"
        {...getRootProps()}
      >
        <input
          type="file"
          name={name}
          required={required}
          ref={hiddenInputRef}
          className="hidden"
          autoComplete="off"
        />
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 justify-center">
          {selectedFiles}
          <div className="flex items-center gap-3">
            <BadgePlus className="text-muted-foreground" />
            <p className="text-muted-foreground">
              Drag n drop your NFT file here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const CreateNftForm = () => {
  const NFT_FILE = "NFT_FILE";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        // Now get the form data as you regularly would
        const formData = new FormData(e.currentTarget);
        const file = formData.get(NFT_FILE) as File | null;
        alert(file?.name);
      }}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <Dropzone name={NFT_FILE} required />
        <div className="flex flex-col gap-4">
          <Input />
          <Button type="submit">Submit</Button>
        </div>
      </div>
    </form>
  );
};
