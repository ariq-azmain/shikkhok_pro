// src/app/api/profile/[username]/questions/route.ts
// ---------------------------------------------------------------
// GET /api/profile/[username]/questions
// Paginated public questions by a user. Cursor = last createdAt.
// ---------------------------------------------------------------

import { NextResponse } from "next/server";
import { getUserPublicProfile, getUserPublicQuestions } from "@/lib/db/user";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const { username } = await params;
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") ?? undefined;

    // Resolve username → userId first
    const profile = await getUserPublicProfile(username);
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await getUserPublicQuestions(profile.id, cursor);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[GET /api/profile/:username/questions]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
