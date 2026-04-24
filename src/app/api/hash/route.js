import { NextResponse } from "next/server";
import crypto from "crypto";
import { hashPassword } from "@/lib/password";

export async function GET(request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { error: "Missing required query parameter: key" },
      { status: 400 },
    );
  }

  const hashedKey = await hashPassword(key);
  return NextResponse.json({ value: hashedKey });
}
