// src/app/api/organizations/[orgId]/route.ts
// GET /api/organizations/[orgId] — Get organization details
// PUT /api/organizations/[orgId] — Update organization (PRINCIPAL only)

import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { successResponse, errorResponse } from '@/lib/org/response';
import { OrgApiError, ORG_ERRORS } from '@/lib/org/errors';
import { getAuthenticatedUser } from '@/lib/org/auth';
import { getUserOrgRole, canPerformAction } from '@/lib/org/permissions';
import { validateUpdateOrgPayload } from '@/lib/org/validation';
import type { OrgWithMembers } from '@/types/organization';

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

    const { data: org, error } = await supabaseAdmin
      .from('organizations')
      .select(
        `
        id, name, slug, logo, description, address, type, createdAt, updatedAt, deletedAt,
        members:org_members (
          id, userId, role, subjects, classes, joinedAt,
          user:users!org_members_userId_fkey (
            id, displayName, email, avatar, username
          )
        )
      `,
      )
      .eq('id', orgId)
      .single();

    if (error || !org) {
      throw new OrgApiError(
        ORG_ERRORS.ORG_NOT_FOUND.statusCode,
        ORG_ERRORS.ORG_NOT_FOUND.code,
        ORG_ERRORS.ORG_NOT_FOUND.message,
      );
    }

    const stats = {
      totalMembers: org.members.length,
      principals: org.members.filter((m: any) => m.role === 'ORG_PRINCIPAL').length,
      admins: org.members.filter((m: any) => m.role === 'ORG_ADMIN').length,
      teachers: org.members.filter((m: any) => m.role === 'ORG_TEACHER').length,
    };

    return successResponse({
      ...org,
      stats,
    });
  } catch (error) {
    if (error instanceof OrgApiError) {
      return errorResponse(error);
    }
    console.error('[GET /api/organizations/[orgId]] error:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    const { orgId } = await params;

    // Check permission
    const hasPermission = await canPerformAction(user.id, orgId, 'UPDATE_ORG');
    if (!hasPermission) {
      throw new OrgApiError(
        ORG_ERRORS.FORBIDDEN.statusCode,
        ORG_ERRORS.FORBIDDEN.code,
        ORG_ERRORS.FORBIDDEN.message,
      );
    }

    const body = await req.json();
    const payload = validateUpdateOrgPayload(body);

    const { data: org, error } = await supabaseAdmin
      .from('organizations')
      .update(payload)
      .eq('id', orgId)
      .select(
        `
        id, name, slug, logo, description, address, type, createdAt, updatedAt, deletedAt,
        members:org_members (
          id, userId, role, subjects, classes, joinedAt,
          user:users!org_members_userId_fkey (
            id, displayName, email, avatar, username
          )
        )
      `,
      )
      .single();

    if (error || !org) {
      console.error('[PUT /api/organizations/[orgId]] error:', error);
      throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
    }

    return successResponse(org);
  } catch (error) {
    if (error instanceof OrgApiError) {
      return errorResponse(error);
    }
    console.error('[PUT /api/organizations/[orgId]] error:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}
