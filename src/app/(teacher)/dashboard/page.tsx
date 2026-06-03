import { auth } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import TeacherDashboardShell from "@/components/teacher-dashboard/TeacherDashboardShell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Teacher Dashboard — Shikkhok Pro",
};

export default async function TeacherDashboardPage() {
  // Server-side auth check using Clerk
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    // Redirect to sign-in is handled by middleware elsewhere; return minimal UI
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted">Please sign in to view the dashboard.</p>
      </main>
    );
  }

  // Use server-side Supabase client that forwards cookies (see src/lib/supabase/server.ts)
  const supabase = await createClient();

  // Resolve project user by clerkId
  const { data: dbUser } = await supabase
    .from("users")
    .select("id, displayName, accountType")
    .eq("clerkId", clerkId)
    .maybeSingle();

  if (!dbUser || dbUser.accountType !== "TEACHER") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted">Access denied. Teacher account required.</p>
      </main>
    );
  }

  const userId = dbUser.id;

  // Fetch aggregated data (similar to the API route) — keep server-side to avoid extra client fetch
  const [membershipsRes, questionsRes, tasksRes] = await Promise.all([
    supabase
      .from("org_members")
      .select(`
        id, role, subjects, classes, joinedAt,
        org:organizations ( id, name, slug, logo, type )
      `)
      .eq("userId", userId),
    supabase
      .from("questions")
      .select(`
        id, title, subject, "className", difficulty, "likesCount", "commentsCount", "createdAt",
        org:organizations(id, name, slug)
      `)
      .eq("createdById", userId)
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .limit(20),
    supabase
      .from("tasks")
      .select(`
        id, title, description, status, assignDate, expireDate, updatedAt, createdAt,
        org:organizations(id, name),
        assignedBy:users!tasks_assignedById_fkey ( id, username, "displayName" )
      `)
      .eq("assignedToId", userId)
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .limit(200),
  ]);

  const memberships = membershipsRes.data ?? [];
  const myQuestions = questionsRes.data ?? [];
  const tasksRows = tasksRes.data ?? [];

  // group tasks by org
  const tasksByOrg: Record<string, any> = {};
  tasksRows.forEach((t: any) => {
    const org = t.org ?? { id: null, name: "Unknown" };
    const orgId = org.id ?? "unknown";
    if (!tasksByOrg[orgId]) tasksByOrg[orgId] = { org, tasks: [] };
    tasksByOrg[orgId].tasks.push(t);
  });

  // fetch notices for orgs
  const orgIds = Array.from(new Set(memberships.map((m: any) => m.org?.id).filter(Boolean)));
  let notices: any[] = [];
  if (orgIds.length > 0) {
    const { data: noticesRows } = await supabase
      .from("notices")
      .select(`
        id, orgId, title, description, type, isPinned, createdAt,
        postedBy:users!notices_postedById_fkey ( id, username, "displayName" )
      `)
      .in("orgId", orgIds)
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .limit(20);
    notices = noticesRows ?? [];
  }

  // compute simple stats
  const tasksAll = tasksRows;
  const statusLabels = ["PENDING", "IN_PROGRESS", "SUBMITTED", "APPROVED", "REJECTED"];
  const statusCounts = statusLabels.map((label) => tasksAll.filter((t: any) => t.status === label).length);

  const stats = {
    tasksPending: statusCounts[0],
    tasksInProgress: statusCounts[1],
    tasksSubmitted: statusCounts[2],
    tasksDone: statusCounts[3],
    tasksRejected: statusCounts[4],
    questionsCreated: myQuestions.length,
  };

  const orgsMember = memberships.map((m: any) => ({
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

  // Render the dashboard shell and pass the aggregated data as props
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <TeacherDashboardShell
          user={{ id: userId, displayName: dbUser.displayName }}
          orgsOwned={orgsOwned}
          orgsMember={orgsMember}
          myQuestions={myQuestions}
          tasksByOrg={tasksByOrg}
          notices={notices}
          stats={stats}
          tasksChart={{ labels: statusLabels, data: statusCounts }}
        />
      </div>
    </main>
  );
}
