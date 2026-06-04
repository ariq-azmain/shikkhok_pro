// src/types/user.ts
export type AccountType = "TEACHER" | "STUDENT" | "PARENT";

export interface UserSummary {
  id: string;
  username?: string | null;
  displayName: string;
  avatar?: string | null;
  accountType: AccountType;
}
