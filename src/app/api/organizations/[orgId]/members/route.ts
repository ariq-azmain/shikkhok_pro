// src/app/api/organizations/[orgId]/members/route.ts
// GET  /api/organizations/[orgId]/members — List members
// POST /api/organizations/[orgId]/members — Add member

import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { successResponse, errorResponse } from '@/lib/org/response';
import { OrgApiError, ORG_ERRORS } from '@/lib/org/errors';
import { getAuthenticatedUser, getUserById } from '@/lib/org/auth';
import { getUserOrgRole, canPerformAction } from '@/lib/org/permissions';
import { validateAddMemberPayload } from '@/lib/org/validation';
import type { OrgRole } from '@/types/organization';

export async function GET(req: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    const { orgId } = await params;

    // Check if user is member
    const userRole = await getUserOrgRole(user.id, orgId);
    if (!userRole) {
      throw new OrgApiError(
        ORG_ERRORS.FORBIDDEN.statusCode,
        ORG_ERRORS.FORBIDDEN.code,
        ORG_ERRORS.FORBIDDEN.message,
      );
    }

    const roleFilter = req.nextUrl.searchParams.get('role');

    let query = supabaseAdmin
      .from('org_members')
      .select(
        `
        id, userId, role, subjects, classes, joinedAt,
        user:users!org_members_userId_fkey (
          id, displayName, email, avatar, username
        )
      `,
      )
      .eq('orgId', orgId);

    if (roleFilter) {
      query = query.eq('role', roleFilter as OrgRole);
    }

    const { data: members, error } = await query.order('joinedAt', { ascending: true });

    if (error) {
      console.error('[GET /api/organizations/[orgId]/members] error:', error);
      throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
    }

    return successResponse(members);
  } catch (error) {
    if (error instanceof OrgApiError) {
      return errorResponse(error);
    }
    console.error('[GET /api/organizations/[orgId]/members] error:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    const { orgId } = await params;

    // Check permission
    const hasPermission = await canPerformAction(user.id, orgId, 'ADD_MEMBER');
    if (!hasPermission) {
      throw new OrgApiError(
        ORG_ERRORS.FORBIDDEN.statusCode,
        ORG_ERRORS.FORBIDDEN.code,
        ORG_ERRORS.FORBIDDEN.message,
      );
    }

    const body = await req.json();
    const payload = validateAddMemberPayload(body);

    // Check target user exists
    const targetUser = await getUserById(payload.userId);
    if (!targetUser) {
      throw new OrgApiError(
        ORG_ERRORS.USER_NOT_FOUND.statusCode,
        ORG_ERRORS.USER_NOT_FOUND.code,
        ORG_ERRORS.USER_NOT_FOUND.message,
      );
    }

    // Check if already member
    const { data: existing } = await supabaseAdmin
      .from('org_members')
      .select('id')
      .eq('userId', payload.userId)
      .eq('orgId', orgId)
      .maybeSingle();

    if (existing) {
      throw new OrgApiError(
        ORG_ERRORS.MEMBER_EXISTS.statusCode,
        ORG_ERRORS.MEMBER_EXISTS.code,
        ORG_ERRORS.MEMBER_EXISTS.message,
      );
    }

    // Add member
    const { data: member, error } = await supabaseAdmin
      .from('org_members')
      .insert({
        userId: payload.userId,
        orgId,
        role: payload.role,
        subjects: payload.subjects || [],
        classes: payload.classes || [],
      })
      .select(
        `
        id, userId, role, subjects, classes, joinedAt,
        user:users!org_members_userId_fkey (
          id, displayName, email, avatar, username
        )
      `,
      )
      .single();

    if (error) {
      console.error('[POST /api/organizations/[orgId]/members] error:', error);
      throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
    }

    return successResponse(member, 201);
  } catch (error) {
    if (error instanceof OrgApiError) {
      return errorResponse(error);
    }
    console.error('[POST /api/organizations/[orgId]/members] error:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}
