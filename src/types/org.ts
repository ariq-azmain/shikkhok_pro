// src/types/org.ts
// Generated from context/schema.prisma — simplified TypeScript interfaces for Organization domain.

export type OrgType = "SCHOOL" | "COLLEGE" | "COACHING" | "MADRASA" | "OTHER";
export type OrgRole = "ORG_PRINCIPAL" | "ORG_ADMIN" | "ORG_TEACHER";

export interface OrgMember {
  id: string;
  userId: string;
  orgId: string;
  role: OrgRole;
  subjects?: string[]; // e.g. ["Mathematics", "Physics"]
  classes?: string[]; // e.g. ["Class 9", "Class 10"]
  joinedAt?: string; // ISO date
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  address?: string | null;
  type: OrgType;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;

  // Lightweight relations — keep as unknown to avoid tight coupling to DB models
  members?: OrgMember[];
  // Other relations exist in DB (questionBanks, notices, tasks, questions)
  [key: string]: any;
}
