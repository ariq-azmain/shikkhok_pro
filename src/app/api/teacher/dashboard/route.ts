// src/app/api/teacher/dashboard/route.ts
// Aggregated dashboard endpoint for authenticated TEACHER users.
//
// Returns:
// {
//   orgsOwned: [...],
//   orgsMember: [...],
//   myQuestions: [...],
//   tasksByOrg: { [orgId]: { org, tasks: [...], counts: {...} } },
//   notices: [...],
//   stats: { tasksPending, tasksDone, questionsCreated, ... },
//   activity: { questionsCreated, commentsMade, likesMade, noticesPosted },
//   tasksChart: { labels: [...], data: [...] }
// }
//
// Minimal, server-only implementation using Supabase service role client
// and Clerk server auth (currentUser). Follows repo API patterns.

import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Use service role client here (server-only). This mirrors other API handlers in repo.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MAX_QUESTIONS = 20;
const MAX_TASKS = 200;
const MAX_NOTICES = 20;

export async function GET() {
  try {
    // 1) Auth: ensure user logged in via Clerk
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Resolve project user row (users table) by clerkId
    const { data: dbUser, error: userErr } = await supabase
      .from("users")
      .select("id, displayName, accountType")
      .eq("clerkId", clerkUser.id)
      .maybeSingle();

    if (userErr) {
      console.error("[GET /api/teacher/dashboard] user lookup error:", userErr);
      return NextResponse.json({ error: "Failed to lookup user" }, { status: 500 });
    }
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3) Authorize: ensure accountType is TEACHER
    if (dbUser.accountType !== "TEACHER") {
      return NextResponse.json({ error: "Forbidden (not a teacher)" }, { status: 403 });
    }

    const userId = dbUser.id;

    // 4) Fetch org memberships (with org details) in one query to avoid N+1
    //    We select org_members.* plus the parent organization fields in-line.
    const { data: memberships, error: memErr } = await supabase
      .from("org_members")
      .select(`
        id, role, subjects, classes, joinedAt,
        org:organizations ( id, name, slug, logo, type )
      `)
      .eq("userId", userId);

    if (memErr) {
      console.error("[GET /api/teacher/dashboard] memberships error:", memErr);
      return NextResponse.json({ error: "Failed to fetch memberships" }, { status: 500 });
    }

    const orgsMember = (memberships ?? []).map((m: any) => ({
      id: m.org?.id,
      name: m.org?.name,
      slug: m.org?.slug,
      logo: m.org?.logo,
      type: m.org?.type,
      role: m.role,
      subjects: m.subjects,
      classes: m.classes,
      joinedAt: m.joinedAt,
    }));

    const orgsOwned = orgsMember.filter((o: any) => o.role === "ORG_PRINCIPAL");

    const orgIds = Array.from(new Set(orgsMember.map((o: any) => o.id).filter(Boolean)));

    // 5) Fetch teacher's recent questions (creator)
    const { data: myQuestions, error: qErr } = await supabase
      .from("questions")
      .select(`
        id, title, subject, "className", difficulty, "likesCount", "commentsCount", "createdAt",
        org:organizations(id, name, slug)
      `)
      .eq("createdById", userId)
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .limit(MAX_QUESTIONS);

    if (qErr) {
      console.error("[GET /api/teacher/dashboard] questions error:", qErr);
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
    }

    // 6) Fetch tasks assigned to this teacher + org info + assigner info
    const { data: tasksRows, error: tasksErr } = await supabase
      .from("tasks")
      .select(`
        id, title, description, status, assignDate, expireDate, updatedAt, createdAt,
        org:organizations(id, name),
        assignedBy:users!tasks_assignedById_fkey ( id, username, "displayName" )
      `)
      .eq("assignedToId", userId)
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .limit(MAX_TASKS);

    if (tasksErr) {
      console.error("[GET /api/teacher/dashboard] tasks error:", tasksErr);
      return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }

    // 7) Group tasks by org and compute per-org counts
    const tasksByOrg: Record<
      string,
      {
        org: { id: string; name: string } | null;
        tasks: any[];
        counts: Record<string, number>;
      }
    > = {};

    (tasksRows ?? []).forEach((t: any) => {
      const org = t.org ?? { id: null, name: "Unknown" };
      const orgId = org.id ?? "unknown";
      if (!tasksByOrg[orgId]) {
        tasksByOrg[orgId] = {
          org,
          tasks: [],
          counts: { PENDING: 0, IN_PROGRESS: 0, SUBMITTED: 0, APPROVED: 0, REJECTED: 0 },
        };
      }
      tasksByOrg[orgId].tasks.push(t);
      const st = t.status ?? "PENDING";
      if (!tasksByOrg[orgId].counts[st]) tasksByOrg[orgId].counts[st] = 0;
      tasksByOrg[orgId].counts[st] += 1;
    });

    // 8) Fetch recent notices for the orgs this teacher is member of
    let notices: any[] = [];
    if (orgIds.length > 0) {
      const { data: noticesRows, error: noticesErr } = await supabase
        .from("notices")
        .select(`
          id, orgId, title, description, type, isPinned, createdAt,
          postedBy:users!notices_postedById_fkey ( id, username, "displayName" )
        `)
        .in("orgId", orgIds)
        .is("deletedAt", null)
        .order("createdAt", { ascending: false })
        .limit(MAX_NOTICES);

      if (noticesErr) {
        console.error("[GET /api/teacher/dashboard] notices error:", noticesErr);
        return NextResponse.json({ error: "Failed to fetch notices" }, { status: 500 });
      }
      notices = noticesRows ?? [];
    }

    // 9) Compute simple stats: derive from fetched rows to minimize DB count queries.
    const tasksAll = tasksRows ?? [];
    const tasksPending = tasksAll.filter((t) => t.status === "PENDING").length;
    const tasksDone = tasksAll.filter((t) => t.status === "APPROVED").length;
    const tasksSubmitted = tasksAll.filter((t) => t.status === "SUBMITTED").length;
    const tasksRejected = tasksAll.filter((t) => t.status === "REJECTED").length;
    const tasksInProgress = tasksAll.filter((t) => t.status === "IN_PROGRESS").length;

    const questionsCreated = (myQuestions ?? []).length;

    // 10) Activity counts: commentsMade, likesMade, noticesPosted (small count queries using head:true)
    //    Use count queries (head: true) to avoid fetching all rows if large.
    const [{ count: commentsCount }, { count: likesCount }, { count: noticesPostedCount }] =
      await Promise.all([
        supabase.from("comments").select("*", { count: "exact", head: true }).eq("userId", userId),
        supabase.from("likes").select("*", { count: "exact", head: true }).eq("userId", userId),
        supabase.from("notices").select("*", { count: "exact", head: true }).eq("postedById", userId),
      ]);

    // Note: supabase JS returns { count: number | null }, unwrap to number with fallback
    const activity = {
      questionsCreated,
      commentsMade: (commentsCount as number) ?? 0,
      likesMade: (likesCount as number) ?? 0,
      noticesPosted: (noticesPostedCount as number) ?? 0,
    };

    // 11) Build tasksChart data (status counts aggregated across all orgs)
    const statusLabels = ["PENDING", "IN_PROGRESS", "SUBMITTED", "APPROVED", "REJECTED"];
    const statusCounts = statusLabels.map((label) =>
      tasksAll.filter((t) => t.status === label).length
    );

    const stats = {
      tasksPending,
      tasksInProgress,
      tasksSubmitted,
      tasksDone,
      tasksRejected,
      questionsCreated,
    };

    // 12) Final response
    return NextResponse.json({
      orgsOwned,
      orgsMember,
      myQuestions: myQuestions ?? [],
      tasksByOrg,
      notices,
      stats,
      activity,
      tasksChart: {
        labels: statusLabels,
        data: statusCounts,
      },
    });
  } catch (err: any) {
    console.error("[GET /api/teacher/dashboard] Unexpected error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
