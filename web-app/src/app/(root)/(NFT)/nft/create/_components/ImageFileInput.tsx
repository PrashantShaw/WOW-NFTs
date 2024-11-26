/* eslint-disable @next/next/no-img-element */
"use client";
import clsx from "clsx";
import { ImageOff, ImagePlus, RefreshCcw } from "lucide-react";
import { ChangeEvent, useCallback, useMemo, useRef, useState } from "react";
import {
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

type ImageFileInputProps<FormDataType extends FieldValues> = {
  register: UseFormRegister<FormDataType>;
  fieldName: string;
  error: FieldError | undefined;
};
const ImageFileInput = <FormDataType extends FieldValues>({
  fieldName,
  register,
  error,
}: ImageFileInputProps<FormDataType>) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const {
    ref: registerRef,
    onChange: registerOnChange,
    ...props
  } = register(fieldName as Path<FormDataType>);

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const selectedFiles = useMemo(() => {
    if (!imageFile) return null;

    const urlImage = URL.createObjectURL(imageFile);

    return (
      <div
        key={imageFile.name}
        className="flex flex-col items-center justify-center gap-3"
      >
        <p className="text-center text-muted-foreground">
          {imageFile.name} - {imageFile.size.toLocaleString()} bytes -{" "}
          {imageFile.type}
        </p>
        {imageFile.type.startsWith("image/") ? (
          <img src={urlImage} alt="selected Image" />
        ) : (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <ImageOff strokeWidth={1} size={20} />
            Only Images are Allowed!
          </p>
        )}
      </div>
    );
  }, [imageFile]);

  const handleUploadFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0];

      if (!file) return;

      setImageFile(file);
      registerOnChange(event);
    },
    [registerOnChange]
  );

  return (
    <div className="">
      <div
        className={clsx(
          "rounded-lg border-dashed border-2 p-10 cursor-pointer h-full flex flex-col items-center gap-3 justify-center",
          error ? "bg-destructive/5 border-destructive" : ""
        )}
        onClick={() => hiddenInputRef.current?.click()}
      >
        <input
          type="file"
          ref={(e) => {
            registerRef(e);
            hiddenInputRef.current = e;
          }}
          onChange={handleUploadFile}
          accept="image/*"
          className="hidden"
          multiple={false}
          autoComplete="off"
          {...props}
        />
        <div className="">
          {selectedFiles}
          {imageFile === null ? (
            <div className="flex flex-col justify-center items-center gap-0">
              <ImagePlus
                className="text-muted-foreground w-10 h-10"
                strokeWidth={1}
              />
              <p className="text-muted-foreground text-lg pt-2">
                Upload your NFT image here
              </p>
              <p className="text-muted-foreground text-sm">
                PNG, JPG, GIF, WEBP, ICO upto 3 MB
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 pt-6">
              <RefreshCcw className="text-muted-foreground" />
              <p className="text-muted-foreground text-lg">Change Image</p>
            </div>
          )}
          {error ? (
            <p className="text-center text-sm font-semibold text-destructive">
              {error.message}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export { ImageFileInput };
