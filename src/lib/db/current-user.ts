// src/lib/db/current-user.ts
// ---------------------------------------------------------------
// Current Authenticated User Helper
// Server Component বা Route Handler এ current user নেওয়ার জন্য।
// Clerk auth() + DB query bridge করে।
// ---------------------------------------------------------------

import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "./user";

/**
 * Server-side: Clerk থেকে clerkId নিয়ে DB থেকে full user আনো।
 * Unauthenticated হলে null return করে।
 */
export async function getCurrentUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  return getUserByClerkId(clerkId);
}

/**
 * Server-side: Current user লাগবেই, না থাকলে error throw করো।
 * Protected route/action এ ব্যবহার করো।
 */
export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

/**
 * User এর Org এ কোনো role আছে কিনা check করো।
 */
export async function getUserOrgRole(clerkId: string, orgId: string) {
  const user = await getUserByClerkId(clerkId);
  if (!user) return null;

  const membership = user.orgMemberships.find((m) => m.orgId === orgId);
  return membership?.role ?? null;
}
