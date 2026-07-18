// src/app/api/organizations/[orgId]/dashboard/route.ts
// GET /api/organizations/[orgId]/dashboard — Role-based dashboard data

import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { successResponse, errorResponse } from '@/lib/org/response';
import { OrgApiError, ORG_ERRORS } from '@/lib/org/errors';
import { getAuthenticatedUser } from '@/lib/org/auth';
import { getUserOrgRole } from '@/lib/org/permissions';
import type { OrgRole, OrgDashboardData } from '@/types/organization';

export async function GET(req: NextRequest, { params }: { params: Promise<{ orgId: string }> }) {
  try {
    const user = await getAuthenticatedUser();
    const { orgId } = await params;

    // Check user role
    const userRole = await getUserOrgRole(user.id, orgId);
    if (!userRole) {
      throw new OrgApiError(
        ORG_ERRORS.FORBIDDEN.statusCode,
        ORG_ERRORS.FORBIDDEN.code,
        ORG_ERRORS.FORBIDDEN.message,
      );
    }

    // Get organization
    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select(
        `
        id, name, slug, logo, type, description, address, createdAt,
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

    if (orgError || !org) {
      throw new OrgApiError(
        ORG_ERRORS.ORG_NOT_FOUND.statusCode,
        ORG_ERRORS.ORG_NOT_FOUND.code,
        ORG_ERRORS.ORG_NOT_FOUND.message,
      );
    }

    // Get user member record
    const { data: userMember } = await supabaseAdmin
      .from('org_members')
      .select('*')
      .eq('userId', user.id)
      .eq('orgId', orgId)
      .maybeSingle();

    // Calculate stats
    const stats = {
      totalMembers: org.members.length,
      principals: org.members.filter((m: any) => m.role === 'ORG_PRINCIPAL').length,
      admins: org.members.filter((m: any) => m.role === 'ORG_ADMIN').length,
      teachers: org.members.filter((m: any) => m.role === 'ORG_TEACHER').length,
    };

    const baseData: OrgDashboardData = {
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        logo: org.logo,
        type: org.type,
        description: org.description,
        address: org.address,
        createdAt: org.createdAt,
      },
      userRole,
      stats,
      canManageMembers: false,
      canManageTasks: false,
      canPostNotices: false,
    };

    // Role-based data
    if (userRole === 'ORG_PRINCIPAL' || userRole === 'ORG_ADMIN') {
      // PRINCIPAL/ADMIN dashboard
      return successResponse({
        ...baseData,
        members: org.members,
        canManageMembers: true,
        canManageTasks: true,
        canPostNotices: true,
      });
    } else {
      // TEACHER dashboard
      const [{ count: myQuestionsCount }, { data: myTasks }] = await Promise.all([
        supabaseAdmin
          .from('questions')
          .select('*', { count: 'exact', head: true })
          .eq('orgId', orgId)
          .eq('createdById', user.id)
          .is('deletedAt', null),
        supabaseAdmin
          .from('tasks')
          .select('id, title, description, status, expireDate, createdAt')
          .eq('orgId', orgId)
          .eq('assignedToId', user.id)
          .order('createdAt', { ascending: false })
          .limit(10),
      ]);

      const pendingTasks = myTasks?.filter((t: any) => t.status === 'PENDING').length || 0;

      return successResponse({
        ...baseData,
        myProfile: {
          displayName: user.displayName,
          email: user.email,
          avatar: user.avatar,
          subjects: userMember?.subjects || [],
          classes: userMember?.classes || [],
          joinedAt: userMember?.joinedAt || new Date().toISOString(),
        },
        myStats: {
          myQuestions: myQuestionsCount || 0,
          assignedTasks: myTasks?.length || 0,
          pendingTasks,
        },
        recentTasks: myTasks,
      });
    }
  } catch (error) {
    if (error instanceof OrgApiError) {
      return errorResponse(error);
    }
    console.error('[GET /api/organizations/[orgId]/dashboard] error:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}
