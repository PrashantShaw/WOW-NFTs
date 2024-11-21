/* eslint-disable @next/next/no-img-element */
import { ArrowDownUp, ImageOff, ImagePlus } from "lucide-react";
import { useRef } from "react";
import { useDropzone } from "react-dropzone";

export function Dropzone(props: { required: boolean; name: string }) {
  const { name } = props;

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const previewImageRef = useRef<HTMLImageElement | null>(null);

  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop: (incomingFiles) => {
      if (hiddenInputRef.current) {
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
        {file.type.startsWith("image/") ? (
          <img ref={previewImageRef} src="/" alt="selected Image" />
        ) : (
          <p className="text-red-500 text-sm flex items-center gap-1">
            <ImageOff strokeWidth={1} size={20} />
            Only Images are Allowed!
          </p>
        )}
      </div>
    );
  });

  return (
    <div className="">
      <div
        className="rounded-lg border-dashed border-2 p-10 cursor-pointer h-full flex flex-col items-center gap-3 justify-center"
        {...getRootProps()}
      >
        <input
          type="file"
          name={name}
          ref={hiddenInputRef}
          className="hidden"
          autoComplete="off"
        />
        <input {...getInputProps({ accept: "image/*" })} />
        <div className="">
          {selectedFiles}
          {acceptedFiles.length === 0 ? (
            <div className="flex flex-col justify-center items-center gap-0">
              <ImagePlus
                className="text-muted-foreground w-10 h-10"
                strokeWidth={1}
              />
              <p className="text-muted-foreground text-lg pt-2">
                Drag n drop your NFT image here
              </p>
              <p className="text-muted-foreground text-sm">
                PNG, JPG, GIF, WEBP, ICO upto 3 MB
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 pt-6">
              <ArrowDownUp className="text-muted-foreground" />
              <p className="text-muted-foreground text-lg">Change Image</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
