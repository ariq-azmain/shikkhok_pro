// src/lib/db/user.ts
// ---------------------------------------------------------------
// User DB helpers — all queries via Supabase service role client.
// No Prisma. Server-only.
// ---------------------------------------------------------------

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ProfileUpdatePayload } from "@/types";

// ── Shared select string for full user ────────────────────────
// Matches the columns in the "users" table (Prisma camelCase → DB column names)
const USER_FULL_SELECT = `
  id, "clerkId", username, "displayName", email,
  avatar, bio, "accountType", "createdAt",
  org_members (
    "orgId", role, subjects, classes,
    organizations ( id, name, slug, logo, type )
  )
` as const;

// ── Sync from Clerk webhook / sign-up ─────────────────────────
export async function syncUserFromClerk({
  clerkId,
  email,
  displayName,
  avatar,
  username,
}: {
  clerkId: string;
  email: string;
  displayName: string;
  avatar?: string;
  username: string;
}) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .upsert(
      {
        clerkId,
        email,
        displayName,
        avatar: avatar ?? null,
        username,
        accountType: "STUDENT",
      },
      {
        onConflict: "clerkId",
        // On conflict, only update these fields (not username/accountType)
        ignoreDuplicates: false,
      },
    )
    .select("id, clerkId, username, displayName, email, avatar, accountType")
    .single();

  if (error) throw new Error(`syncUserFromClerk: ${error.message}`);
  return data;
}

// ── Fetch full authenticated user (server-side auth checks) ───
export async function getUserByClerkId(clerkId: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select(USER_FULL_SELECT)
    .eq("clerkId", clerkId)
    .is("deletedAt", null)
    .single();

  if (error) {
    // PGRST116 = "no rows" — not a real error
    if (error.code === "PGRST116") return null;
    throw new Error(`getUserByClerkId: ${error.message}`);
  }

  // Reshape org_members → orgMemberships to match UserFull type
  const { org_members, ...rest } = data as any;
  return {
    ...rest,
    orgMemberships: (org_members ?? []).map((m: any) => ({
      orgId: m.orgId,
      role: m.role,
      subjects: m.subjects,
      classes: m.classes,
      org: m.organizations,
    })),
  };
}

// ── Fetch public profile (for /profile/[username]) ────────────
export async function getUserPublicProfile(username: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select(
      `id, username, "displayName", avatar, bio, "accountType", "createdAt"`,
    )
    .eq("username", username)
    .is("deletedAt", null)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`getUserPublicProfile: ${error.message}`);
  }

  // Count public questions separately (Supabase doesn't do _count like Prisma)
  const { count } = await supabaseAdmin
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("createdById", data.id)
    .eq("visibility", "PUBLIC")
    .is("deletedAt", null);

  return { ...data, questionCount: count ?? 0 };
}

// ── Fetch user's public questions (cursor-based) ───────────────
const PAGE_SIZE = 12;

export async function getUserPublicQuestions(
  userId: string,
  cursor?: string, // last createdAt value
) {
  let query = supabaseAdmin
    .from("questions")
    .select(
      `
      id, title, subject, "className", difficulty,
      "totalMarks", "likesCount", "commentsCount", "viewsCount", "createdAt",
      creator:users!questions_createdById_fkey (
        id, username, "displayName", avatar, "accountType"
      )
    `,
    )
    .eq("createdById", userId)
    .eq("visibility", "PUBLIC")
    .is("deletedAt", null)
    .order("createdAt", { ascending: false })
    .limit(PAGE_SIZE + 1);

  if (cursor) {
    query = query.lt("createdAt", cursor);
  }

  const { data, error } = await query;

  if (error) throw new Error(`getUserPublicQuestions: ${error.message}`);

  const hasMore = data.length > PAGE_SIZE;
  const items = hasMore ? data.slice(0, PAGE_SIZE) : data;
  const nextCursor = hasMore ? items[items.length - 1].createdAt : null;

  return { data: items, nextCursor };
}

// ── Update profile fields ──────────────────────────────────────
export async function updateUserProfile(
  clerkId: string,
  payload: ProfileUpdatePayload,
) {
  // Build update object — only include defined keys
  const update: Record<string, unknown> = {};
  if (payload.displayName !== undefined)
    update.displayName = payload.displayName;
  if (payload.bio !== undefined) update.bio = payload.bio || null;
  if (payload.avatar !== undefined) update.avatar = payload.avatar;

  const { data, error } = await supabaseAdmin
    .from("users")
    .update(update)
    .eq("clerkId", clerkId)
    .select(`id, username, "displayName", avatar, bio, "accountType"`)
    .single();

  if (error) throw new Error(`updateUserProfile: ${error.message}`);
  return data;
}

// ── Update account type (onboarding) ──────────────────────────
export async function updateUserAccountType(
  clerkId: string,
  accountType: "TEACHER" | "STUDENT" | "PARENT",
) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update({ accountType })
    .eq("clerkId", clerkId)
    .select("id, accountType")
    .single();

  if (error) throw new Error(`updateUserAccountType: ${error.message}`);
  return data;
}

// ── Username availability check ────────────────────────────────
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const { count, error } = await supabaseAdmin
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("username", username);

  if (error) throw new Error(`isUsernameAvailable: ${error.message}`);
  return (count ?? 0) === 0;
}
