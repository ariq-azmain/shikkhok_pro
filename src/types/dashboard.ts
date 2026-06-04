// src/types/dashboard.ts
// ---------------------------------------------------------------
// Dashboard widget & component types (strict, no 'any')
// ---------------------------------------------------------------

import type { TaskStatus } from "./common";

// ── Dashboard User Summary ──────────────────────────────────────
export interface DashboardUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  accountType: string;
}

// ── Tasks Preview (for dashboard widget) ─────────────────────
export interface TaskPreview {
  id: string;
  title: string;
  status: TaskStatus;
  assignDate: string;
  expireDate: string | null;
  org: {
    id: string;
    name: string;
  };
}

// ── Notice Preview (for dashboard widget) ───────────────────
export interface NoticePreview {
  id: string;
  title: string;
  type: string;
  isPinned: boolean;
  createdAt: string;
  org: {
    id: string;
    name: string;
  };
}

// ── My Questions Summary ────────────────────────────────────
export interface QuestionSummary {
  id: string;
  title: string;
  subject: string;
  className: string;
  difficulty: string;
  visibility: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
}

// ── Organization with Member Count ─────────────────────────
export interface OrgCard {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  type: string;
  role: string; // ORG_PRINCIPAL, ORG_ADMIN, ORG_TEACHER
  memberCount?: number;
}

// ── Task Group by Organization ─────────────────────────────
export interface TaskGroup {
  orgId: string;
  orgName: string;
  tasks: TaskPreview[];
  statusCounts: Record<TaskStatus, number>;
}

// ── Activity Stats ──────────────────────────────────────────
export interface ActivityStats {
  questionsCreated: number;
  commentsMade: number;
  likesMade: number;
  noticesPosted: number;
}

// ── Dashboard Shell Props ───────────────────────────────────
export interface DashboardShellProps {
  user: DashboardUser;
  tasksPreview: TaskPreview[];
  noticesPreview: NoticePreview[];
  tasksCount: number;
  noticesCount: number;
}

// ── Section Card Props (generic widget) ─────────────────────
export interface SectionCardProps<T = unknown> {
  title: string;
  count: number;
  href: string;
  items: T[];
  type: "tasks" | "notices" | "editor" | "organizations" | "questions";
  isLoading?: boolean;
}

// ── Task Card Props (task item renderer) ────────────────────
export interface TaskCardProps {
  task: TaskPreview;
  onClick?: (taskId: string) => void;
}

// ── Notice Card Props (notice item renderer) ────────────────
export interface NoticeCardProps {
  notice: NoticePreview;
  onClick?: (noticeId: string) => void;
}

// ── Organization List Props ─────────────────────────────────
export interface OrganizationListProps {
  orgsOwned: OrgCard[];
  orgsMember: OrgCard[];
  onSelectOrg?: (orgId: string) => void;
}

// ── Tasks By Organization Props ─────────────────────────────
export interface TasksByOrgProps {
  taskGroups: TaskGroup[];
  onTaskClick?: (taskId: string) => void;
}

// ── Charts Props ────────────────────────────────────────────
export interface TasksChartProps {
  labels: TaskStatus[];
  data: number[];
  isLoading?: boolean;
}

export interface ActivityPieChartProps {
  data: ActivityStats;
  isLoading?: boolean;
}
