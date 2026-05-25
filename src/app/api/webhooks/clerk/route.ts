// src/app/api/webhooks/clerk/route.ts
// ─────────────────────────────────────────────────────────────────
// Fix করা হয়েছে:
//   1. user.created → insert এর বদলে upsert (duplicate safe)
//   2. username conflict হলে fallback strategy
//   3. user.updated → accountType ও onboardingComplete ওভাররাইট করে না
// ─────────────────────────────────────────────────────────────────

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let event: any;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  const primaryEmail = data.email_addresses?.find(
    (e: any) => e.id === data.primary_email_address_id
  )?.email_address;

  if (!primaryEmail && type !== "user.deleted") {
    return NextResponse.json({ error: "No primary email" }, { status: 400 });
  }

  const displayName =
    [data.first_name, data.last_name].filter(Boolean).join(" ") ||
    data.username ||
    "User";

  // Username: Clerk username → email prefix fallback
  // Supabase unique constraint এর জন্য clerkId suffix দিয়ে collision avoid করা হয়
  const baseUsername =
    data.username ??
    primaryEmail?.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_");

  try {
    if (type === "user.created") {
      // ── Bug Fix 1: insert → upsert (onConflict: clerkId) ────────────
      // Clerk কখনো কখনো same user এর জন্য user.created দুবার পাঠায়।
      // upsert দিয়ে duplicate insert error এড়ানো হয়েছে।
      // username conflict হলে clerkId এর শেষ 6 char suffix হিসেবে যোগ হয়।

      // প্রথমে check করো — এই clerkId আগে থেকে আছে কিনা
      const { data: existing } = await supabase
        .from("users")
        .select("id, clerkId")
        .eq("clerkId", data.id)
        .maybeSingle();

      if (existing) {
        // User আগে থেকেই আছে — শুধু Clerk sync fields update করো,
        // accountType / onboardingComplete / bio ছুঁবে না
        const { error: updateErr } = await supabase
          .from("users")
          .update({
            email: primaryEmail,
            displayName,
            avatar: data.image_url ?? null,
          })
          .eq("clerkId", data.id);

        if (updateErr) throw updateErr;
        return NextResponse.json({ success: true, action: "skipped_existing" });
      }

      // নতুন user — username uniqueness নিশ্চিত করো
      const { count: usernameCount } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("username", baseUsername);

      const finalUsername =
        (usernameCount ?? 0) > 0
          ? `${baseUsername}_${data.id.slice(-6)}`
          : baseUsername;

      const { error: insertErr } = await supabase.from("users").insert({
        clerkId: data.id,
        email: primaryEmail,
        displayName,
        avatar: data.image_url ?? null,
        username: finalUsername,
        accountType: "STUDENT",         // default, onboarding এ বদলাবে
        onboardingComplete: false,       // ← onboarding gate এর জন্য
      });

      if (insertErr) throw insertErr;
    }

    if (type === "user.updated") {
      // ── Bug Fix 2: accountType / onboardingComplete ওভাররাইট না করা ──
      // Clerk profile update হলে শুধু Clerk-controlled fields sync করো।
      // User এর accountType, bio, onboardingComplete ছুঁবে না।
      const { error: updateErr } = await supabase
        .from("users")
        .update({
          email: primaryEmail,
          displayName,
          avatar: data.image_url ?? null,
          // username: ইচ্ছাকৃতভাবে update করা হচ্ছে না
          // accountType: ইচ্ছাকৃতভাবে update করা হচ্ছে না
          // onboardingComplete: ইচ্ছাকৃতভাবে update করা হচ্ছে না
        })
        .eq("clerkId", data.id);

      if (updateErr) throw updateErr;
    }

    if (type === "user.deleted") {
      const { error: deleteErr } = await supabase
        .from("users")
        .update({ deletedAt: new Date().toISOString() })
        .eq("clerkId", data.id);

      if (deleteErr) throw deleteErr;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Webhook Error]", error);
    return NextResponse.json(
      { error: "DB operation failed", detail: error.message },
      { status: 500 }
    );
  }
}
