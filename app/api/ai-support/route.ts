import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "StudiesMate AI is disabled during the trial/testing phase. It will be enabled after beta feedback and fixes.",
    },
    { status: 503 }
  );
}
