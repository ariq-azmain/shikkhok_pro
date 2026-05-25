// src/app/(main)/profile/page.tsx
// ─────────────────────────────────────────────────────────────────
// Clerk SIGN_IN_FALLBACK_REDIRECT_URL এ /profile দেওয়া হয়।
// Sign-in এর পরে Clerk এই static URL এ পাঠায়।
// এই server component নিজের username বের করে
// /profile/[username] এ redirect করে দেয়।
// ─────────────────────────────────────────────────────────────────

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/lib/db";

export default async function ProfileRedirectPage() {
  const { userId: clerkId } = await auth();

  // auth() fail করলে middleware আগেই sign-in এ পাঠিয়ে দেবে।
  // তবু safety-র জন্য:
  if (!clerkId) {
    redirect("/sign-in");
  }

  const user = await getUserByClerkId(clerkId);

  if (!user) {
    // Onboarding শেষ হয়নি
    redirect("/onboarding");
  }

  // নিজের প্রোফাইলে redirect
  redirect(`/profile/${user.username}`);
}
