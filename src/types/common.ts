// src/types/common.ts
// ---------------------------------------------------------------
// Platform-wide shared primitive types & enums
// (mirrors Prisma enums so client code doesn't import from @prisma/client)
// ---------------------------------------------------------------

export type AccountType = "TEACHER" | "STUDENT" | "PARENT";

export type OrgRole = "ORG_PRINCIPAL" | "ORG_ADMIN" | "ORG_TEACHER";

export type OrgType = "SCHOOL" | "COLLEGE" | "COACHING" | "MADRASA" | "OTHER";

export type Visibility = "PUBLIC" | "SCHOOL" | "PRIVATE";

export type Difficulty = "EASY" | "NORMAL" | "HARD";

export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export type NoticeType =
  | "EVENTS"
  | "URGENT"
  | "GENERAL"
  | "EXAM"
  | "HOLIDAY"
  | "OTHER";

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_SUBMITTED"
  | "TASK_APPROVED"
  | "TASK_REJECTED"
  | "NOTICE_POSTED"
  | "COMMENT_REPLY"
  | "QUESTION_LIKED";

/** Generic API response wrapper */
export interface ApiResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: string;
}

/** Cursor-based pagination */
export interface PaginatedResponse<T> {
  data: T[];
  nextCursor: string | null;
}
