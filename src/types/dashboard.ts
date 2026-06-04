// src/types/dashboard.ts
import type { UserSummary } from "./user";
import type { OrgSummary } from "./org";
import type { TaskPreview } from "./task";

export interface NoticePreview {
  id: string;
  title: string;
  type?: string | null;
  isPinned?: boolean;
  createdAt?: string | null;
  org?: OrgSummary | null;
}

export interface DashboardStats {
  tasksCount: number;
  noticesCount: number;
  statusCounts?: Record<string, number>;
  activityCounts?: {
    questionsCreated?: number;
    commentsMade?: number;
    likesMade?: number;
    noticesPosted?: number;
  };
}

export interface DashboardProps {
  user: UserSummary;
  tasksPreview: TaskPreview[];
  noticesPreview: NoticePreview[];
  stats: DashboardStats;
}
