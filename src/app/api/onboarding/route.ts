// src/app/api/onboarding/route.ts

import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const VALID_TYPES = ["TEACHER", "STUDENT", "PARENT"] as const;

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Body parse আগেই করো — dbUser check এর আগে ─────────────────
    const text = await req.text();
    if (!text) {
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 },
      );
    }

    let body: { accountType?: string; bio?: string };
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { accountType, bio } = body;

    if (!accountType || !VALID_TYPES.includes(accountType as any)) {
      return NextResponse.json(
        { error: "Invalid account type" },
        { status: 400 },
      );
    }

    // ── DB তে user আছে কিনা check করো ──────────────────────────────
    const { data: dbUser, error: fetchErr } = await supabase
      .from("users")
      .select("id, onboardingComplete, accountType")
      .eq("clerkId", user.id)
      .maybeSingle();

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 500 });
    }

    // ── onboarding আগেই complete হয়ে থাকলে block করো ───────────────
    // এটা সেই attack কে prevent করে:
    //   Existing user → manually /onboarding URL এ যাওয়া →
    //   submit করে নিজের accountType overwrite করা।
    if (dbUser?.onboardingComplete === true) {
      return NextResponse.json(
        { error: "Onboarding already completed.", alreadyDone: true },
        { status: 409 },
      );
    }

    const updateData: Record<string, unknown> = {
      accountType,
      onboardingComplete: true,
    };
    if (bio && bio.trim().length > 0) {
      updateData.bio = bio.trim();
    }

    if (!dbUser) {
      // ── Webhook race condition: DB তে user নেই, এখানেই insert করো ──
      // Clerk এর user.created webhook কখনো কখনো onboarding submit এর
      // পরে process হয়। তাই এখানে সব Clerk data দিয়ে user তৈরি করো।

      const primaryEmail = user.emailAddresses.find(
        (e) => e.id === user.primaryEmailAddressId,
      )?.emailAddress;

      if (!primaryEmail) {
        return NextResponse.json(
          { error: "No primary email found" },
          { status: 400 },
        );
      }

      const displayName =
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username ||
        "User";

      const baseUsername =
        user.username ??
        primaryEmail
          .split("@")[0]
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "_");

      // Username uniqueness check
      const { count: usernameCount } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("username", baseUsername);

      const finalUsername =
        (usernameCount ?? 0) > 0
          ? `${baseUsername}_${user.id.slice(-6)}`
          : baseUsername;

      const { error: insertErr } = await supabase.from("users").insert({
        clerkId: user.id,
        email: primaryEmail,
        displayName,
        avatar: user.imageUrl ?? null,
        username: finalUsername,
        accountType,
        onboardingComplete: true,
        ...(bio && bio.trim().length > 0 ? { bio: bio.trim() } : {}),
      });

      if (insertErr) {
        return NextResponse.json({ error: insertErr.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // ── User আছে, শুধু update করো ───────────────────────────────────
    // .eq("onboardingComplete", false) — double safety,
    // race condition এ দুটো request একসাথে এলে একটাই জিতবে।
    const { error: updateErr } = await supabase
      .from("users")
      .update(updateData)
      .eq("clerkId", user.id)
      .eq("onboardingComplete", false);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
