"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useCallback, useEffect, useState } from "react";
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
import { getEthFromWei, getListingPrice, textCapitalize } from "@/lib/utils";
import useCreateNFT from "@/hooks/useCreateNFT";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { NFT_CATEGORIES } from "@/lib/constants";
import { usePreviewNFT } from "@/hooks/usePreviewNFT";

const imageSchemaZ = z
  .custom<FileList>(
    (fileList) => fileList instanceof FileList && fileList.length > 0,
    { message: "Image file is required!" }
  )
  .refine((fileList) => fileList[0]?.type.startsWith("image/"), {
    message: "Selected Item is not an image!",
  })
  .refine((fileList) => fileList[0]?.size <= 4 * 1024 * 1024, {
    message: "Max file size is 4MB",
  });
// TODO: increase max file size to 10mb, use pinata's client side approach - https://docs.pinata.cloud/frameworks/next-js-ipfs

const nftSchemaZ = z.object({
  nftImage: imageSchemaZ,
  itemName: z.string().min(1, { message: "Required!" }),
  description: z
    .string()
    .min(1, { message: "Required!" })
    .max(180, { message: "Max 180 characters allowed!" }),
  website: z.string().min(1, { message: "Required!" }).url(),
  category: z.string().min(1, { message: "Required!" }),
  price: z.coerce
    .number({ message: "Not a number!" })
    .gt(0, { message: "Must be a positive value!" }),
});

export type NftFormData = z.infer<typeof nftSchemaZ>;
// type NftFormFieldNames = keyof NftFormData;

const defaultFormValues = {
  itemName: "",
  description: "",
  nftImage: undefined,
  category: "",
  website: "",
  price: undefined,
};

type CreateNftFormProps = {
  fromPreview: boolean;
};
export const CreateNftForm = ({ fromPreview }: CreateNftFormProps) => {
  const previewCtx = usePreviewNFT();
  const defaultValues =
    fromPreview && previewCtx?.previewData
      ? previewCtx?.previewData
      : defaultFormValues;

  console.log("defaultValues : ", defaultValues);
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setError,
    trigger,
    getValues,
  } = useForm<NftFormData>({
    resolver: zodResolver(nftSchemaZ),
    defaultValues,
  });
  const [listingPriceEth, setListingPriceEth] = useState(0);
  const { createNFT, isPending } = useCreateNFT();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const listingPriceWei = await getListingPrice();
        const listingPriceEth = getEthFromWei(listingPriceWei);
        setListingPriceEth(listingPriceEth);
      } catch (error) {
        console.log("Error fetching listing price ::", error);
        toast.error("Error fetching Listing Price!", {
          duration: 5000,
          position: "bottom-right",
        });
      }
    })().catch(() => {});
  }, [setError]);

  console.log("form image errro:", errors);
  const onSubmitNftForm: SubmitHandler<NftFormData> = useCallback(
    async (formData) => {
      // const { nftImage, itemName, description, website, category } = formData;
      try {
        if (formData.price < listingPriceEth) {
          setError("price", {
            message: "Price must be great than or equal to the listing price!",
          });
          return;
        }
        const result = await createNFT({ ...formData, listingPriceEth });
        if (result.success) {
          router.replace("/nft/collections");
        }
      } catch (error: unknown | Error) {
        console.log("Error creating nft!", error);
        toast.error("Failed to create NFT!", {
          duration: 5000,
          position: "bottom-right",
        });
      }
    },
    [createNFT, listingPriceEth, router, setError]
  );

  const handlePreview = useCallback(async () => {
    const isValid = await trigger();

    if (!isValid) return;

    const values = getValues();
    previewCtx?.setPreviewData(values);
    router.push("/nft/create/preview");
  }, [getValues, previewCtx, router, trigger]);

  return (
    <form onSubmit={handleSubmit(onSubmitNftForm)}>
      <div className="grid md:grid-cols-2 gap-6">
        <ImageFileInput<NftFormData>
          fieldName={"nftImage"}
          register={register}
          error={errors.nftImage}
          imgFile={defaultValues.nftImage?.[0] ?? null}
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
                    {NFT_CATEGORIES.map((category, idx) => (
                      <SelectItem key={idx} value={category}>
                        {textCapitalize(category)}
                      </SelectItem>
                    ))}
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
            name={"price"}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div className="relative mb-2">
                <Label htmlFor="price">
                  Price{" "}
                  <span className="text-muted-foreground text-sm">(ETH)</span>{" "}
                </Label>
                <Input
                  {...field}
                  id="price"
                  type="number"
                  placeholder="Set a selling price for this NFT"
                  className={clsx(
                    " focus-visible:ring-2 focus-visible:ring-offset-0 resize-none",
                    error
                      ? "ring-2 ring-red-600  focus-visible:ring-red-600"
                      : ""
                  )}
                />
                <p className="text-xs pt-1 text-muted-foreground m-0">
                  Price should be greate than{" "}
                  <span className="font-bold text-violet-500">
                    {listingPriceEth} ETH
                  </span>{" "}
                  (Listing Price).
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
          <div className="grid grid-cols-2 gap-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <LoaderCircle className="animate-spin" /> Creating...
                </>
              ) : (
                "Create"
              )}
            </Button>
            <Button type="button" variant={"secondary"} onClick={handlePreview}>
              Preview
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
