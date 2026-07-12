// src/lib/db/current-user.ts
// ---------------------------------------------------------------
// Server-side helpers to get the currently authenticated user.
// Clerk auth() → clerkId → Supabase users table.
// ---------------------------------------------------------------

import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "./user";

/** Returns full DB user or null if unauthenticated. */
export async function getCurrentUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;
  return getUserByClerkId(clerkId);
}

/** Throws if unauthenticated — use in protected routes/actions. */
export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

/** Check a user's role inside a specific org. */
export async function getUserOrgRole(clerkId: string, orgId: string) {
  const user = await getUserByClerkId(clerkId);
  if (!user) return null;
  const membership = user.orgMemberships.find(
    (m: { orgId: string }) => m.orgId === orgId,
  );
  return membership?.role ?? null;
}
