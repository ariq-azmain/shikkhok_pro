// src/app/api/organizations/[orgId]/members/[memberId]/route.ts
// PUT    /api/organizations/[orgId]/members/[memberId] — Update member
// DELETE /api/organizations/[orgId]/members/[memberId] — Remove member

import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { successResponse, errorResponse } from '@/lib/org/response';
import { OrgApiError, ORG_ERRORS } from '@/lib/org/errors';
import { getAuthenticatedUser } from '@/lib/org/auth';
import { getOrgMember, canUpdateMember, canRemoveMember } from '@/lib/org/permissions';
import { validateUpdateMemberPayload } from '@/lib/org/validation';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string; memberId: string }> },
) {
  try {
    const user = await getAuthenticatedUser();
    const { orgId, memberId } = await params;

    // Check if member exists
    const member = await getOrgMember(memberId, orgId);
    if (!member) {
      throw new OrgApiError(
        ORG_ERRORS.MEMBER_NOT_FOUND.statusCode,
        ORG_ERRORS.MEMBER_NOT_FOUND.code,
        ORG_ERRORS.MEMBER_NOT_FOUND.message,
      );
    }

    // Check permission
    const canUpdate = await canUpdateMember(user.id, orgId, memberId);
    if (!canUpdate) {
      throw new OrgApiError(
        ORG_ERRORS.FORBIDDEN.statusCode,
        ORG_ERRORS.FORBIDDEN.code,
        ORG_ERRORS.FORBIDDEN.message,
      );
    }

    const body = await req.json();
    const payload = validateUpdateMemberPayload(body);

    const { data: updated, error } = await supabaseAdmin
      .from('org_members')
      .update(payload)
      .eq('id', memberId)
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
      console.error('[PUT /api/organizations/[orgId]/members/[memberId]] error:', error);
      throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
    }

    return successResponse(updated);
  } catch (error) {
    if (error instanceof OrgApiError) {
      return errorResponse(error);
    }
    console.error('[PUT /api/organizations/[orgId]/members/[memberId]] error:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ orgId: string; memberId: string }> },
) {
  try {
    const user = await getAuthenticatedUser();
    const { orgId, memberId } = await params;

    // Check if member exists
    const member = await getOrgMember(memberId, orgId);
    if (!member) {
      throw new OrgApiError(
        ORG_ERRORS.MEMBER_NOT_FOUND.statusCode,
        ORG_ERRORS.MEMBER_NOT_FOUND.code,
        ORG_ERRORS.MEMBER_NOT_FOUND.message,
      );
    }

    // Prevent removing principal
    if (member.role === 'ORG_PRINCIPAL') {
      throw new OrgApiError(
        ORG_ERRORS.CANNOT_REMOVE_PRINCIPAL.statusCode,
        ORG_ERRORS.CANNOT_REMOVE_PRINCIPAL.code,
        ORG_ERRORS.CANNOT_REMOVE_PRINCIPAL.message,
      );
    }

    // Check permission
    const canRemove = await canRemoveMember(user.id, orgId, memberId);
    if (!canRemove) {
      throw new OrgApiError(
        ORG_ERRORS.FORBIDDEN.statusCode,
        ORG_ERRORS.FORBIDDEN.code,
        ORG_ERRORS.FORBIDDEN.message,
      );
    }

    const { error } = await supabaseAdmin
      .from('org_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      console.error('[DELETE /api/organizations/[orgId]/members/[memberId]] error:', error);
      throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
    }

    return successResponse({
      success: true,
      message: 'Member removed successfully',
      memberId,
    });
  } catch (error) {
    if (error instanceof OrgApiError) {
      return errorResponse(error);
    }
    console.error('[DELETE /api/organizations/[orgId]/members/[memberId]] error:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}
