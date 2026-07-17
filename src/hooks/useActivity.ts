"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import type { NoticePreview, TaskPreview, DashboardStats } from "@/types";

export interface DashboardActivity {
  tasksPreview: TaskPreview[];
  noticesPreview: NoticePreview[];
  stats: DashboardStats;
}

/**
 * Fetches and aggregates activity data for the teacher dashboard.
 * This function handles all database queries and calculations.
 * Should be called from Server Components or Server Actions only.
 *
 * @returns {Promise<DashboardActivity>} Activity data including tasks, notices, and stats
 * @throws {Error} If user is not authenticated or authorization fails
 */
export async function useActivity(): Promise<DashboardActivity> {
  // ============================================================
  // 1. Get authenticated user
  // ============================================================
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    throw new Error("User not authenticated");
  }

  const supabase = await createClient();

  // ============================================================
  // 2. Fetch database user
  // ============================================================
  const { data: dbUser, error: userErr } = await supabase
    .from("users")
    .select("id, username, displayName, avatar, accountType")
    .eq("clerkId", clerkId)
    .maybeSingle();

  if (userErr || !dbUser) {
    throw new Error(
      `User lookup failed: ${userErr?.message || "User not found"}`
    );
  }

  if (dbUser.accountType !== "TEACHER") {
    throw new Error("Access denied. Teacher account required.");
  }

  const userId = dbUser.id;

  // ============================================================
  // 3. Fetch user's organization IDs (for notices)
  // ============================================================
  const { data: orgMemberships, error: orgErr } = await supabase
    .from("org_members")
    .select("orgId")
    .eq("userId", userId);

  if (orgErr) {
    console.error("[useActivity] org membership fetch error:", orgErr);
  }

  const orgIds = orgMemberships?.map((r) => r.orgId) ?? [];

  // ============================================================
  // 4. Fetch tasks assigned to user
  // ============================================================
  const { data: tasksData, error: tasksErr } = await supabase
    .from("tasks")
    .select("id, title, status, assignDate, expireDate, org:organizations(id, name)")
    .eq("assignedToId", userId)
    .is("deletedAt", null)
    .order("createdAt", { ascending: false })
    .limit(4);

  if (tasksErr) {
    console.error("[useActivity] tasks fetch error:", tasksErr);
  }

  const tasksPreview: TaskPreview[] = (tasksData ?? []).map((task: any) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    assignDate: task.assignDate,
    expireDate: task.expireDate,
    org: task.org,
  }));

  // ============================================================
  // 5. Fetch notices for user's organizations
  // ============================================================
  let noticesData: any[] = [];
  if (orgIds.length > 0) {
    const { data: noticesQueryResult, error: noticesErr } = await supabase
      .from("notices")
      .select("id, title, type, isPinned, createdAt, org:organizations(id, name)")
      .in("orgId", orgIds)
      .is("deletedAt", null)
      .order("isPinned", { ascending: false })
      .order("createdAt", { ascending: false })
      .limit(4);

    if (noticesErr) {
      console.error("[useActivity] notices fetch error:", noticesErr);
    }

    noticesData = noticesQueryResult ?? [];
  }

  const noticesPreview: NoticePreview[] = noticesData.map((notice: any) => ({
    id: notice.id,
    title: notice.title,
    type: notice.type,
    isPinned: notice.isPinned,
    createdAt: notice.createdAt,
    org: notice.org,
  }));

  // ============================================================
  // 6. Fetch task status counts
  // ============================================================
  const { data: taskStatusData, error: statusErr } = await supabase
    .from("tasks")
    .select("status")
    .eq("assignedToId", userId)
    .is("deletedAt", null);

  if (statusErr) {
    console.error("[useActivity] task status fetch error:", statusErr);
  }

  const statusCounts = (taskStatusData ?? []).reduce(
    (acc: Record<string, number>, task: any) => {
      acc[task.status] = (acc[task.status] ?? 0) + 1;
      return acc;
    },
    {
      PENDING: 0,
      IN_PROGRESS: 0,
      SUBMITTED: 0,
      APPROVED: 0,
      REJECTED: 0,
    }
  );

  // ============================================================
  // 7. Fetch activity counts (questions, comments, likes, notices)
  // ============================================================

  // Count questions created by user
  const { count: questionsCreatedCount, error: questionsErr } = await supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("createdById", userId)
    .is("deletedAt", null);

  // Count comments made by user
  const { count: commentsMadeCount, error: commentsErr } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("userId", userId)
    .is("deletedAt", null);

  // Count likes made by user
  const { count: likesMadeCount, error: likesErr } = await supabase
    .from("likes")
    .select("id", { count: "exact", head: true })
    .eq("userId", userId);

  // Count notices posted by user in their orgs
  let noticesPostedCount = 0;
  if (orgIds.length > 0) {
    const { count: noticesCount, error: noticesPostedErr } = await supabase
      .from("notices")
      .select("id", { count: "exact", head: true })
      .eq("postedById", userId)
      .in("orgId", orgIds)
      .is("deletedAt", null);

    if (noticesPostedErr) {
      console.error("[useActivity] notices posted fetch error:", noticesPostedErr);
    }
    noticesPostedCount = noticesCount ?? 0;
  }

  if (questionsErr) {
    console.error("[useActivity] questions count error:", questionsErr);
  }
  if (commentsErr) {
    console.error("[useActivity] comments count error:", commentsErr);
  }
  if (likesErr) {
    console.error("[useActivity] likes count error:", likesErr);
  }

  // ============================================================
  // 8. Get total task and notice counts
  // ============================================================
  const { count: totalTasksCount, error: totalTasksErr } = await supabase
    .from("tasks")
    .select("id", { count: "exact", head: true })
    .eq("assignedToId", userId)
    .is("deletedAt", null);

  const { count: totalNoticesCount, error: totalNoticesErr } =
    orgIds.length > 0
      ? await supabase
          .from("notices")
          .select("id", { count: "exact", head: true })
          .in("orgId", orgIds)
          .is("deletedAt", null)
      : { count: 0, error: null };

  if (totalTasksErr) {
    console.error("[useActivity] total tasks count error:", totalTasksErr);
  }
  if (totalNoticesErr) {
    console.error("[useActivity] total notices count error:", totalNoticesErr);
  }

  // ============================================================
  // 9. Build stats object
  // ============================================================
  const stats: DashboardStats = {
    tasksCount: totalTasksCount ?? 0,
    noticesCount: totalNoticesCount ?? 0,
    statusCounts,
    activityCounts: {
      questionsCreated: questionsCreatedCount ?? 0,
      commentsMade: commentsMadeCount ?? 0,
      likesMade: likesMadeCount ?? 0,
      noticesPosted: noticesPostedCount,
    },
  };

  return {
    tasksPreview,
    noticesPreview,
    stats,
  };
}
