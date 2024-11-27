"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageFileInput } from "./ImageFileInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

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
  nftImage: imageSchemaZ,
  itemName: z.string().min(1, { message: "Required!" }),
  description: z
    .string()
    .min(1, { message: "Required!" })
    .max(180, { message: "Max 180 characters allowed!" }),
  website: z.string().min(1, { message: "Required!" }).url(),
  category: z.string().min(1, { message: "Required!" }),
  // creatorId: z.coerce.number().min(1, { message: "creator Id is Required!" }),
});

export type NftFormData = z.infer<typeof nftSchemaZ>;
// type NftFormFieldNames = keyof NftFormData;

export const CreateNftForm = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<NftFormData>({
    resolver: zodResolver(nftSchemaZ),
    defaultValues: {
      itemName: "",
      description: "",
      nftImage: undefined,
    },
  });

  console.log("form image errro:", errors);
  const onSubmitNftForm: SubmitHandler<NftFormData> = async (formData) => {
    try {
      console.log("NFT formData :", formData);
      const imageData = new FormData();
      imageData.set("nftImage", formData.nftImage[0]);
      const uploadRequest = await fetch("/api/nft-file", {
        method: "POST",
        body: imageData,
      });
      const ipfsUrl = await uploadRequest.json();
      console.log("ipfsUrl :", ipfsUrl);
    } catch (error: unknown | Error) {
      console.log("Error create nft!", error);
      toast.error("Failed to create NFT!", {
        duration: 5000,
        position: "bottom-right",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmitNftForm)}>
      <div className="grid md:grid-cols-2 gap-6">
        <ImageFileInput<NftFormData>
          fieldName={"nftImage"}
          register={register}
          error={errors.nftImage}
        />
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
                  placeholder="What shall we call this item?"
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
            name={"website"}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div className="relative mb-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  {...field}
                  id="website"
                  placeholder="example.com"
                  className={clsx(
                    " focus-visible:ring-2 focus-visible:ring-offset-0 resize-none",
                    error
                      ? "ring-2 ring-red-600  focus-visible:ring-red-600"
                      : ""
                  )}
                />
                <p className="text-xs pt-1 text-muted-foreground m-0">
                  Marketplace will include a link to this URL on this
                  item&apos;s detail page, so that users can click to learn more
                  about it. You are welcome to link to your own webpage with
                  more details.
                </p>
                {error ? (
                  <p className="absolute top-[105%] right-0 text-xs text-red-600">
                    {error.message}
                  </p>
                ) : null}
              </div>
            )}
          />
          <Controller
            name={"category"}
            control={control}
            render={({
              field: { onChange, ...rest },
              fieldState: { error },
            }) => (
              <div className="relative mb-2">
                <Label>category</Label>
                <Select {...rest} onValueChange={onChange}>
                  <SelectTrigger
                    className={clsx(
                      " focus-visible:ring-2 focus-visible:ring-offset-0 resize-none",
                      error
                        ? "ring-2 ring-red-600  focus-visible:ring-red-600"
                        : ""
                    )}
                  >
                    <SelectValue
                      className="placeholder:text-muted-foreground"
                      placeholder="Select a catagory for this NFT"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="character">Character</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>

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
                  placeholder="Write some description about this item..."
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
