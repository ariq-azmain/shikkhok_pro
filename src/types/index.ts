// src/types/index.ts
// ---------------------------------------------------------------
// Single barrel export for ALL types in the project.
//
// Usage:
//   import type { Question, UserFull, OrgRole } from "@/types"
//
// ---------------------------------------------------------------

// Shared primitives & enums
export type * from "./common";

// User & landing UI types
export type * from "./user";

// Question, content, feed, comments
export type * from "./question";

// Organization, tasks, notices, notifications
export type * from "./org";

// Dashboard specific types
export type * from "./dashboard";
