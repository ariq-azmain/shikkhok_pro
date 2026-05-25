// src/types/org.ts
// ---------------------------------------------------------------
// Organization, Task, Notice, Notification types
// ---------------------------------------------------------------

import type { OrgRole, OrgType, TaskStatus, NoticeType, NotificationType } from "./common";

// ── Organization ───────────────────────────────────────────────
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  address: string | null;
  type: OrgType;
  createdAt: string;
}

// ── Member with user info ──────────────────────────────────────
export interface OrgMemberWithUser {
  id: string;
  orgId: string;
  role: OrgRole;
  subjects: string[];
  classes: string[];
  joinedAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
    accountType: string;
  };
}

// ── Task ───────────────────────────────────────────────────────
export interface Task {
  id: string;
  orgId: string;
  title: string;
  description: string | null;
  assignDate: string;
  expireDate: string | null;
  status: TaskStatus;
  feedback: string;
  approveMessage: string;
  createdAt: string;
  assignedTo: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  };
  assignedBy: {
    id: string;
    username: string;
    displayName: string;
  };
  submittedQuestion?: {
    id: string;
    title: string;
  } | null;
}

// ── Notice ─────────────────────────────────────────────────────
export interface Notice {
  id: string;
  orgId: string;
  title: string;
  description: string;
  type: NoticeType;
  isPinned: boolean;
  createdAt: string;
  postedBy: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  };
}

// ── Notification ───────────────────────────────────────────────
export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}
