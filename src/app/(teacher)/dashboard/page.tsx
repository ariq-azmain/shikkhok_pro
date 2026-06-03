import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import DashboardShell from "@/components/teacher/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Teacher Dashboard — Shikkhok Pro",
};

export default async function Page() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--text-muted)]">Please sign in to view the dashboard.</p>
      </main>
    );
  }

  const supabase = await createClient();

  // Resolve project user by clerkId (include username + avatar)
  const { data: dbUser, error: userErr } = await supabase
    .from("users")
    .select("id, username, displayName, avatar, accountType")
    .eq("clerkId", clerkId)
    .maybeSingle();

  if (userErr || !dbUser) {
    console.error("[TeacherDashboard v2] user lookup error:", userErr);
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--text-muted)]">Failed to load user profile.</p>
      </main>
    );
  }

  if (dbUser.accountType !== "TEACHER") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--text-muted)]">Access denied. Teacher account required.</p>
      </main>
    );
  }

  const userId = dbUser.id;

  // Fetch overview data: recent tasks & notices + counts for quick summaries
  const [tasksPreviewRes, noticesPreviewRes, tasksCountRes, noticesCountRes] = await Promise.all([
    supabase
      .from("tasks")
      .select(`id, title, status, assignDate, expireDate, org:organizations(id, name)`)
      .eq("assignedToId", userId)
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .limit(4),
    supabase
      .from("notices")
      .select(`id, title, type, isPinned, createdAt, org:organizations(id, name)`)
      .in("orgId", (await supabase.from("org_members").select("orgId").eq("userId", userId)).data?.map((r: any) => r.orgId) ?? [])
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .limit(4),
    supabase.from("tasks").select("id", { count: "exact", head: true }).eq("assignedToId", userId),
    supabase.from("notices").select("id", { count: "exact", head: true }).in("orgId", (await supabase.from("org_members").select("orgId").eq("userId", userId)).data?.map((r: any) => r.orgId) ?? []),
  ]);

  const tasksPreview = tasksPreviewRes.data ?? [];
  const noticesPreview = noticesPreviewRes.data ?? [];
  const tasksCount = tasksCountRes.count ?? 0;
  const noticesCount = noticesCountRes.count ?? 0;

  return (
    <DashboardShell user={dbUser} tasksPreview={tasksPreview} noticesPreview={noticesPreview} tasksCount={tasksCount} noticesCount={noticesCount} />
  );
}
