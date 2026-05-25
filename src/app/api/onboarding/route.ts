// src/app/api/onboarding/route.ts
// ─────────────────────────────────────────────────────────────────
// Fix করা হয়েছে:
//   1. onboardingComplete: true আছে এমন user কে block করা
//   2. accountType পরিবর্তন prevent করা existing completed users এর জন্য
// ─────────────────────────────────────────────────────────────────

import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VALID_TYPES = ["TEACHER", "STUDENT", "PARENT"] as const;

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Bug Fix 3: onboardingComplete check ─────────────────────────
    // DB থেকে current user fetch করো এবং onboardingComplete চেক করো।
    // যদি আগেই complete হয়ে থাকে → 409 Conflict।
    // এটা সেই attack কে block করে:
    //   Sign-up URL এ manually গিয়ে → onboarding page এ আসা →
    //   submit করে নিজের accountType overwrite করা।

    const { data: dbUser, error: fetchErr } = await supabase
      .from("users")
      .select("id, onboardingComplete, accountType")
      .eq("clerkId", user.id)
      .maybeSingle();

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    if (!dbUser) {
      // Webhook এখনো process হয়নি (race condition)
      // এই ক্ষেত্রে insert করে দাও
      return NextResponse.json(
        { error: "User record not found. Please wait a moment and try again." },
        { status: 404 }
      );
    }

    if (dbUser.onboardingComplete === true) {
      // আগেই onboarding complete — redirect করে দাও, overwrite করো না
      return NextResponse.json(
        { error: "Onboarding already completed.", alreadyDone: true },
        { status: 409 }
      );
    }

    // ── Parse & validate body ───────────────────────────────────────
    const text = await req.text();
    if (!text) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    let body: { accountType?: string; bio?: string };
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { accountType, bio } = body;

    if (!accountType || !VALID_TYPES.includes(accountType as any)) {
      return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
    }

    // ── Update DB: accountType + bio + onboardingComplete: true ─────
    const updateData: Record<string, unknown> = {
      accountType,
      onboardingComplete: true,   // ← একবার set হলে আর পরিবর্তন হবে না
    };
    if (bio && bio.trim().length > 0) {
      updateData.bio = bio.trim();
    }

    const { error: updateErr } = await supabase
      .from("users")
      .update(updateData)
      .eq("clerkId", user.id)
      .eq("onboardingComplete", false); // double-check: false থাকলেই update

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}
