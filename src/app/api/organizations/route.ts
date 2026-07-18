// src/app/api/organizations/route.ts
// POST /api/organizations — Create new organization (TEACHER only)
// GET  /api/organizations — List user's organizations

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { successResponse, errorResponse } from '@/lib/org/response';
import { OrgApiError, ORG_ERRORS } from '@/lib/org/errors';
import { getAuthenticatedUser, verifyTeacherAccount, getUserById } from '@/lib/org/auth';
import { validateCreateOrgPayload } from '@/lib/org/validation';
import { generateUniqueSlug } from '@/lib/org/slug';
import type { Organization, OrgWithMembers } from '@/types/organization';

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    await verifyTeacherAccount(user);

    const body = await req.json();
    const payload = validateCreateOrgPayload(body);

    // Generate slug if not provided
    let slug = payload.slug;
    if (!slug) {
      slug = await generateUniqueSlug(payload.name);
    } else {
      // Validate provided slug doesn't exist
      const { data: existing } = await supabaseAdmin
        .from('organizations')
        .select('id')
        .eq('slug', slug.toLowerCase())
        .maybeSingle();

      if (existing) {
        throw new OrgApiError(
          ORG_ERRORS.ORG_SLUG_TAKEN.statusCode,
          ORG_ERRORS.ORG_SLUG_TAKEN.code,
          ORG_ERRORS.ORG_SLUG_TAKEN.message,
        );
      }
    }

    // Create organization
    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        name: payload.name,
        slug: slug.toLowerCase(),
        type: payload.type,
        description: payload.description || null,
        address: payload.address || null,
        logo: payload.logo || null,
      })
      .select()
      .single();

    if (orgError || !org) {
      console.error('[POST /api/organizations] org creation error:', orgError);
      throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
    }

    // Add creator as ORG_PRINCIPAL
    const { data: member, error: memberError } = await supabaseAdmin
      .from('org_members')
      .insert({
        userId: user.id,
        orgId: org.id,
        role: 'ORG_PRINCIPAL',
        subjects: [],
        classes: [],
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

    if (memberError) {
      console.error('[POST /api/organizations] member creation error:', memberError);
      throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
    }

    const result: OrgWithMembers = {
      ...org,
      members: [member as never],
    };

    return successResponse(result, 201);
  } catch (error) {
    if (error instanceof OrgApiError) {
      return errorResponse(error);
    }
    console.error('[POST /api/organizations] error:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();

    const { data: memberships, error } = await supabaseAdmin
      .from('org_members')
      .select(
        `
        id, role, subjects, classes, joinedAt,
        org:organizations (
          id, name, slug, logo, type, description, createdAt
        )
      `,
      )
      .eq('userId', user.id);

    if (error) {
      console.error('[GET /api/organizations] error:', error);
      throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
    }

    const orgs = memberships.map((membership: any) => ({
      id: membership.org.id,
      name: membership.org.name,
      slug: membership.org.slug,
      logo: membership.org.logo,
      type: membership.org.type,
      description: membership.org.description,
      role: membership.role,
      subjects: membership.subjects,
      classes: membership.classes,
      joinedAt: membership.joinedAt,
      createdAt: membership.org.createdAt,
    }));

    return successResponse(orgs);
  } catch (error) {
    if (error instanceof OrgApiError) {
      return errorResponse(error);
    }
    console.error('[GET /api/organizations] error:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}
