// src/app/api/onboarding/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VALID_TYPES = ["TEACHER", "STUDENT", "PARENT"];

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { accountType } = await req.json();

  if (!VALID_TYPES.includes(accountType)) {
    return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
  }

  const { error } = await supabase
    .from("users")
    .update({ accountType })
    .eq("clerkId", clerkId);

  if (error) {
    console.error("[Onboarding Error]", error);
    return NextResponse.json({ error: "DB update failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, accountType });
}
