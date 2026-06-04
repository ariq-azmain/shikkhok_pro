// src/types/task.ts
import type { OrgSummary } from "./org";

export interface TaskPreview {
  id: string;
  title: string;
  status: string;
  assignDate?: string | null;
  expireDate?: string | null;
  org?: OrgSummary | null;
}
