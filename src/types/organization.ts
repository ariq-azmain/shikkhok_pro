
// src/types/organization.ts
export type OrgRole = 'ORG_PRINCIPAL' | 'ORG_ADMIN' | 'ORG_TEACHER';
export type OrgType = 'SCHOOL' | 'COLLEGE' | 'COACHING' | 'MADRASA' | 'OTHER';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  address: string | null;
  type: OrgType;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface User {
  id: string;
  clerkId: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  accountType: 'TEACHER' | 'STUDENT' | 'PARENT';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OrgMember {
  id: string;
  userId: string;
  orgId: string;
  role: OrgRole;
  subjects: string[];
  classes: string[];
  joinedAt: string;
}

export interface OrgMemberWithUser extends OrgMember {
  user: Omit<User, 'bio' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
}

export interface OrgWithMembers extends Organization {
  members: OrgMemberWithUser[];
}

export interface OrgStats {
  totalMembers: number;
  principals: number;
  admins: number;
  teachers: number;
}

export interface OrgDashboardData {
  organization: Pick<Organization, 'id' | 'name' | 'slug' | 'logo' | 'type' | 'description' | 'address' | 'createdAt'>;
  userRole: OrgRole;
  stats: OrgStats;
  members?: OrgMemberWithUser[];
  canManageMembers: boolean;
  canManageTasks: boolean;
  canPostNotices: boolean;
  myProfile?: {
    displayName: string;
    email: string;
    avatar: string | null;
    subjects: string[];
    classes: string[];
    joinedAt: string;
  };
  myStats?: {
    myQuestions: number;
    assignedTasks: number;
    pendingTasks: number;
  };
  recentTasks?: Record<string, unknown>[];
}

export interface CreateOrgPayload {
  name: string;
  type: OrgType;
  description?: string;
  address?: string;
  logo?: string;
  slug?: string;
}

export interface UpdateOrgPayload {
  name?: string;
  description?: string | null;
  address?: string | null;
  logo?: string | null;
}

export interface AddMemberPayload {
  userId: string;
  role: OrgRole;
  subjects?: string[];
  classes?: string[];
}

export interface UpdateMemberPayload {
  role?: Exclude<OrgRole, 'ORG_PRINCIPAL'>;
  subjects?: string[];
  classes?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

