import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/lib/pinata";
import { PINATA_FILE_METADATA_NAME } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("nftImage") as unknown as File;
    const itemName = data.get("itemName") as string;
    const description = data.get("description") as string;
    const category = data.get("category") as string;
    const website = data.get("website") as string;

    const uploadData = await pinata.upload.file(file, {
      metadata: {
        name: PINATA_FILE_METADATA_NAME,
        keyValues: {
          itemName,
          description,
          category,
          website,
        },
      },
    });

    return NextResponse.json(
      { ipfsHash: uploadData.IpfsHash, isDuplicate: uploadData.isDuplicate },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
