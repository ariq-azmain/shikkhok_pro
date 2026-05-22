// src/app/api/webhooks/clerk/route.ts
// ---------------------------------------------------------------
// Clerk Webhook Handler
// Clerk এ user তৈরি/আপডেট/মুছলে DB sync হয়।
//
// Setup:
// 1. Clerk Dashboard > Webhooks > Add Endpoint
// 2. URL: https://yourdomain.com/api/webhooks/clerk
// 3. Events: user.created, user.updated, user.deleted
// 4. Signing Secret → CLERK_WEBHOOK_SECRET এ দাও
// ---------------------------------------------------------------

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

type ClerkUserData = {
  id: string;
  email_addresses: { email_address: string; id: string }[];
  primary_email_address_id: string;
  first_name: string | null;
  last_name: string | null;
  image_url: string;
  username: string | null;
};

type WebhookEvent = {
  type: "user.created" | "user.updated" | "user.deleted";
  data: ClerkUserData;
};

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "CLERK_WEBHOOK_SECRET is not set" },
      { status: 500 }
    );
  }

  // svix signature headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Signature verify করো
  const wh = new Webhook(WEBHOOK_SECRET);
  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = event;

  // Primary email বের করো
  const primaryEmail = data.email_addresses.find(
    (e) => e.id === data.primary_email_address_id
  )?.email_address;

  if (!primaryEmail) {
    return NextResponse.json({ error: "No primary email" }, { status: 400 });
  }

  const displayName =
    [data.first_name, data.last_name].filter(Boolean).join(" ") ||
    data.username ||
    "User";

  // Username: Clerk username থাকলে সেটা, না থাকলে email prefix
  const username =
    data.username ?? primaryEmail.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "_");

  try {
    switch (type) {
      case "user.created":
        await prisma.user.create({
          data: {
            clerkId: data.id,
            email: primaryEmail,
            displayName,
            avatar: data.image_url,
            username,
          },
        });
        break;

      case "user.updated":
        await prisma.user.update({
          where: { clerkId: data.id },
          data: {
            email: primaryEmail,
            displayName,
            avatar: data.image_url,
          },
        });
        break;

      case "user.deleted":
        // Soft delete — hard delete চাইলে deleteMany ব্যবহার করো
        await prisma.user.update({
          where: { clerkId: data.id },
          data: { deletedAt: new Date() },
        });
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Clerk Webhook Error]", error);
    return NextResponse.json({ error: "DB operation failed" }, { status: 500 });
  }
}
