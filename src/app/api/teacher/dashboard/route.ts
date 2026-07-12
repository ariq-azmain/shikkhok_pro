import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// src/app/api/teacher/dashboard/route.ts
// Aggregated dashboard endpoint for authenticated TEACHER users.
// Uses supabaseAdmin (service role) to query the database server-side.

const MAX_QUESTIONS = 20;
const MAX_TASKS = 200;
const MAX_NOTICES = 20;

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Resolve project user row
    const { data: dbUser, error: userErr } = await supabaseAdmin
      .from("users")
      .select("id, displayName, accountType")
      .eq("clerkId", clerkUser.id)
      .maybeSingle();

    if (userErr) {
      console.error("[GET /api/teacher/dashboard] user lookup error:", userErr);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (dbUser.accountType !== "TEACHER") {
      return NextResponse.json(
        { error: "Forbidden (not a teacher)" },
        { status: 403 },
      );
    }

    const userId = dbUser.id;

    // Batch queries — avoid N+1 by selecting related records inline
    const [
      { data: memberships, error: memErr },
      { data: myQuestions, error: qErr },
      { data: tasksRows, error: tasksErr },
    ] = await Promise.all([
      supabaseAdmin
        .from("org_members")
        .select(
          `
          id, role, subjects, classes, joinedAt,
          org:organizations ( id, name, slug, logo, type )
        `,
        )
        .eq("userId", userId),
      supabaseAdmin
        .from("questions")
        .select(
          `
          id, title, subject, "className", difficulty, "likesCount", "commentsCount", "createdAt", content,
          org:organizations(id, name, slug)
        `,
        )
        .eq("createdById", userId)
        .is("deletedAt", null)
        .order("createdAt", { ascending: false })
        .limit(MAX_QUESTIONS),
      supabaseAdmin
        .from("tasks")
        .select(
          `
          id, title, description, status, assignDate, expireDate, updatedAt, createdAt,
          org:organizations(id, name),
          assignedBy:users!tasks_assignedById_fkey ( id, username, "displayName" )
        `,
        )
        .eq("assignedToId", userId)
        .is("deletedAt", null)
        .order("createdAt", { ascending: false })
        .limit(MAX_TASKS),
    ]);

    if (memErr || qErr || tasksErr) {
      console.error("[GET /api/teacher/dashboard] data fetch error:", {
        memErr,
        qErr,
        tasksErr,
      });
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
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
    const orgIds = Array.from(
      new Set(orgsMember.map((o: any) => o.id).filter(Boolean)),
    );

    // Group tasks
    const tasksByOrg: Record<string, any> = {};
    (tasksRows ?? []).forEach((t: any) => {
      const org = t.org ?? { id: null, name: "Unknown" };
      const orgId = org.id ?? "unknown";
      if (!tasksByOrg[orgId]) tasksByOrg[orgId] = { org, tasks: [] };
      tasksByOrg[orgId].tasks.push(t);
    });

    // Fetch notices for the orgs
    let notices: any[] = [];
    if (orgIds.length > 0) {
      const { data: noticesRows, error: noticesErr } = await supabaseAdmin
        .from("notices")
        .select(
          `
          id, orgId, title, description, type, isPinned, createdAt,
          postedBy:users!notices_postedById_fkey ( id, username, "displayName" )
        `,
        )
        .in("orgId", orgIds)
        .is("deletedAt", null)
        .order("createdAt", { ascending: false })
        .limit(MAX_NOTICES);

      if (noticesErr) {
        console.error(
          "[GET /api/teacher/dashboard] notices error:",
          noticesErr,
        );
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 },
        );
      }
      notices = noticesRows ?? [];
    }

    // Activity counts (use head:true to get counts without fetching rows)
    const [
      { count: commentsCount },
      { count: likesCount },
      { count: noticesPostedCount },
    ] = await Promise.all([
      supabaseAdmin
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("userId", userId),
      supabaseAdmin
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("userId", userId),
      supabaseAdmin
        .from("notices")
        .select("*", { count: "exact", head: true })
        .eq("postedById", userId),
    ]);

    const activity = {
      questionsCreated: (myQuestions ?? []).length,
      commentsMade: (commentsCount as number) ?? 0,
      likesMade: (likesCount as number) ?? 0,
      noticesPosted: (noticesPostedCount as number) ?? 0,
    };

    // Build task status chart
    const statusLabels = [
      "PENDING",
      "IN_PROGRESS",
      "SUBMITTED",
      "APPROVED",
      "REJECTED",
    ];
    const tasksAll = tasksRows ?? [];
    const statusCounts = statusLabels.map(
      (label) => tasksAll.filter((t) => t.status === label).length,
    );

    const stats = {
      tasksPending: statusCounts[0],
      tasksInProgress: statusCounts[1],
      tasksSubmitted: statusCounts[2],
      tasksDone: statusCounts[3],
      tasksRejected: statusCounts[4],
      questionsCreated: (myQuestions ?? []).length,
    };

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
    // Log full error details server-side but return generic message to client
    console.error("[GET /api/teacher/dashboard] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
