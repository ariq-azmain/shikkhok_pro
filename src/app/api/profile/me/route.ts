// src/app/api/profile/me/route.ts
// ---------------------------------------------------------------
// GET  /api/profile/me  — নিজের full profile (auth required)
// PATCH /api/profile/me — displayName / bio / avatar update
// ---------------------------------------------------------------

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserByClerkId, updateUserProfile } from "@/lib/db/user";
import type { ProfileUpdatePayload } from "@/types";

// ── GET ────────────────────────────────────────────────────────
export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[GET /api/profile/me]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ── PATCH ──────────────────────────────────────────────────────
export async function PATCH(req: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: ProfileUpdatePayload;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { displayName, bio, avatar } = body;

    // ── Validation ─────────────────────────────────────────────
    if (displayName !== undefined) {
      const trimmed = displayName.trim();
      if (trimmed.length < 2 || trimmed.length > 60) {
        return NextResponse.json(
          { error: "Display name must be 2–60 characters" },
          { status: 422 }
        );
      }
    }
    if (bio !== undefined && bio.length > 200) {
      return NextResponse.json(
        { error: "Bio must be 200 characters or fewer" },
        { status: 422 }
      );
    }

    const updated = await updateUserProfile(clerkId, {
      ...(displayName !== undefined ? { displayName: displayName.trim() } : {}),
      ...(bio !== undefined ? { bio: bio.trim() } : {}),
      ...(avatar !== undefined ? { avatar } : {}),
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    console.error("[PATCH /api/profile/me]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
