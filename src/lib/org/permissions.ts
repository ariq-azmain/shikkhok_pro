
// src/lib/org/permissions.ts
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { OrgRole, OrgMember } from '@/types/organization';
import { OrgApiError, ORG_ERRORS } from './errors';

export async function getUserOrgRole(
  userId: string,
  orgId: string,
): Promise<OrgRole | null> {
  const { data, error } = await supabaseAdmin
    .from('org_members')
    .select('role')
    .eq('userId', userId)
    .eq('orgId', orgId)
    .maybeSingle();

  if (error) {
    console.error('[getUserOrgRole] DB error:', error);
    throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
  }

  return data?.role || null;
}

export async function getOrgMember(
  memberId: string,
  orgId: string,
): Promise<OrgMember | null> {
  const { data, error } = await supabaseAdmin
    .from('org_members')
    .select('*')
    .eq('id', memberId)
    .eq('orgId', orgId)
    .maybeSingle();

  if (error) {
    console.error('[getOrgMember] DB error:', error);
    throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
  }

  return data;
}

export async function canPerformAction(
  userId: string,
  orgId: string,
  action: 'UPDATE_ORG' | 'ADD_MEMBER' | 'REMOVE_MEMBER' | 'UPDATE_MEMBER',
): Promise<boolean> {
  const role = await getUserOrgRole(userId, orgId);
  if (!role) return false;

  const permissions: Record<string, OrgRole[]> = {
    UPDATE_ORG: ['ORG_PRINCIPAL'],
    ADD_MEMBER: ['ORG_PRINCIPAL', 'ORG_ADMIN'],
    REMOVE_MEMBER: ['ORG_PRINCIPAL', 'ORG_ADMIN'],
    UPDATE_MEMBER: ['ORG_PRINCIPAL', 'ORG_ADMIN'],
  };

  return permissions[action]?.includes(role) || false;
}

export async function canRemoveMember(
  userId: string,
  orgId: string,
  targetMemberId: string,
): Promise<boolean> {
  const userRole = await getUserOrgRole(userId, orgId);
  if (!userRole) return false;

  if (userRole === 'ORG_PRINCIPAL') return true;

  if (userRole === 'ORG_ADMIN') {
    const member = await getOrgMember(targetMemberId, orgId);
    return member?.role === 'ORG_TEACHER';
  }

  return false;
}

export async function canUpdateMember(
  userId: string,
  orgId: string,
  targetMemberId: string,
): Promise<boolean> {
  const userRole = await getUserOrgRole(userId, orgId);
  if (!userRole) return false;

  if (userRole === 'ORG_PRINCIPAL') return true;

  if (userRole === 'ORG_ADMIN') {
    const member = await getOrgMember(targetMemberId, orgId);
    return member?.role === 'ORG_TEACHER';
  }

  return false;
}
