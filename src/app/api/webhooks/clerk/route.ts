// src/app/api/webhooks/clerk/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

// Supabase service role client — server only
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

  const username =
    data.username ??
    primaryEmail?.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_");

  try {
    if (type === "user.created") {
      const { error } = await supabase.from("users").insert({
        clerkId: data.id,
        email: primaryEmail,
        displayName,
        avatar: data.image_url,
        username,
        accountType: "STUDENT",
      });
      if (error) throw error;
    }

    if (type === "user.updated") {
      const { error } = await supabase
        .from("users")
        .update({ email: primaryEmail, displayName, avatar: data.image_url })
        .eq("clerkId", data.id);
      if (error) throw error;
    }

    if (type === "user.deleted") {
      const { error } = await supabase
        .from("users")
        .update({ deletedAt: new Date().toISOString() })
        .eq("clerkId", data.id);
      if (error) throw error;
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
