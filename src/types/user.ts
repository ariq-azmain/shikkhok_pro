// src/types/user.ts
// ---------------------------------------------------------------
// User & Organization related types
// ---------------------------------------------------------------

import type { AccountType, OrgRole, OrgType } from "./common";

// ── Org (slim, for embedding) ─────────────────────────────────
export interface OrgSlim {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  type: OrgType;
}

// ── OrgMembership (on user) ───────────────────────────────────
export interface OrgMembership {
  orgId: string;
  role: OrgRole;
  subjects: string[];
  classes: string[];
  org: OrgSlim;
}

// ── Full user (authenticated / own profile) ───────────────────
export interface UserFull {
  id: string;
  clerkId: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  accountType: AccountType;
  createdAt: string;
  orgMemberships: OrgMembership[];
}

// ── Public user (other people's profiles) ─────────────────────
export interface UserPublic {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  accountType: AccountType;
  createdAt: string;
  /** total public questions by this user */
  questionCount?: number;
}

// ── Profile update payload ─────────────────────────────────────
export interface ProfileUpdatePayload {
  displayName?: string;
  bio?: string;
  avatar?: string;
}

// ── Landing page UI types (formerly in types/index.ts) ────────
export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  school: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CurriculumClass {
  label: string;
  range: string;
}
