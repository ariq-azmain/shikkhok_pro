// src/app/api/profile/[username]/route.ts
// ---------------------------------------------------------------
// GET /api/profile/[username] — Public profile + question count
// ---------------------------------------------------------------

import { NextResponse } from "next/server";
import { getUserPublicProfile } from "@/lib/db/user";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;

    const user = await getUserPublicProfile(username);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[GET /api/profile/:username]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
