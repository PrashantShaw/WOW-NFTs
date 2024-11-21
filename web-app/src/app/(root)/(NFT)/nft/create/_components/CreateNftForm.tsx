"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { Dropzone } from "./Dropzone";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const imageSchemaZ = z
  .custom<FileList>(
    (fileList) => fileList instanceof FileList && fileList.length > 0,
    { message: "Image file is required!" }
  )
  .refine((fileList) => fileList[0]?.type.startsWith("image/"), {
    message: "Selected Item is not an image!",
  })
  .refine((fileList) => fileList[0]?.size <= 5 * 1024 * 1024, {
    message: "Max file size is 5MB",
  });

const nftSchemaZ = z.object({
  image: imageSchemaZ,
  itemName: z.string().min(1, { message: "Required!" }),
  description: z.string().min(1, { message: "Required!" }),
  website: z.string().min(1, { message: "Required!" }),
  category: z.string().min(1, { message: "Required!" }),
  // creatorId: z.coerce.number().min(1, { message: "creator Id is Required!" }),
});

type NftFormData = z.infer<typeof nftSchemaZ>;

export const CreateNftForm = () => {
  const {
    control,
    handleSubmit,
    // register,
    // formState: { errors, isSubmitting },
  } = useForm<NftFormData>({
    resolver: zodResolver(nftSchemaZ),
    defaultValues: {
      itemName: "",
      description: "",
      image: undefined,
    },
  });
  const onSubmitNftForm: SubmitHandler<NftFormData> = async (formData) => {
    console.log("NFT formData :", formData);
  };
  return (
    <form onSubmit={handleSubmit(onSubmitNftForm)}>
      <div className="grid md:grid-cols-2 gap-6">
        <Dropzone name={"nftImage"} required />
        <div className="flex flex-col gap-2">
          <Controller
            name={"itemName"}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div className="relative mb-2">
                <Label htmlFor="itemName">NFT name</Label>
                <Input
                  {...field}
                  id="itemName"
                  placeholder="What's on your mind? Let the world know.."
                  className={clsx(
                    " focus-visible:ring-2 focus-visible:ring-offset-0 resize-none",
                    error
                      ? "ring-2 ring-red-600  focus-visible:ring-red-600"
                      : ""
                  )}
                />
                {error ? (
                  <p className="absolute top-[105%] right-0 text-xs text-red-600">
                    {error.message}
                  </p>
                ) : null}
              </div>
            )}
          />
          <Controller
            name={"description"}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div className="relative mb-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  {...field}
                  id="description"
                  rows={3}
                  placeholder="What's on your mind? Let the world know.."
                  className={clsx(
                    " focus-visible:ring-2 focus-visible:ring-offset-0 resize-none",
                    error
                      ? "ring-2 ring-red-600  focus-visible:ring-red-600"
                      : ""
                  )}
                />
                {error ? (
                  <p className="absolute top-[105%] right-0 text-xs text-red-600">
                    {error.message}
                  </p>
                ) : null}
              </div>
            )}
          />
          <div className="h-2" />
          <Button type="submit">Submit</Button>
        </div>
      </div>
    </form>
  );
};
