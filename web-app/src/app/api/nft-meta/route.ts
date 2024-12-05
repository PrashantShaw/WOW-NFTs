import { PINATA_FILE_METADATA_NAME } from "@/lib/constants";
import { pinata } from "@/lib/pinata";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const filesMeta = await pinata.listFiles().name(PINATA_FILE_METADATA_NAME);
    return NextResponse.json({ filesMeta }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
