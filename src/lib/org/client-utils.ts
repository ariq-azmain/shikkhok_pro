// src/lib/org/client-utils.ts
import type { OrgRole } from '@/types/organization';

export const ORG_ROLE_LABELS: Record<OrgRole, string> = {
  ORG_PRINCIPAL: 'Principal',
  ORG_ADMIN: 'Admin',
  ORG_TEACHER: 'Teacher',
};

export const ORG_ROLE_COLORS: Record<OrgRole, string> = {
  ORG_PRINCIPAL: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  ORG_ADMIN: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  ORG_TEACHER: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
};

export const ORG_TYPE_LABELS: Record<string, string> = {
  SCHOOL: '🏫 School',
  COLLEGE: '🎓 College',
  COACHING: '📚 Coaching Center',
  MADRASA: '🕌 Madrasa',
  OTHER: '🏢 Other',
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isOrgPrincipal(role: OrgRole): boolean {
  return role === 'ORG_PRINCIPAL';
}

export function isOrgAdmin(role: OrgRole): boolean {
  return role === 'ORG_ADMIN';
}

export function canManageMembers(role: OrgRole): boolean {
  return role === 'ORG_PRINCIPAL' || role === 'ORG_ADMIN';
}

export function canManageTasks(role: OrgRole): boolean {
  return role === 'ORG_PRINCIPAL' || role === 'ORG_ADMIN';
}
