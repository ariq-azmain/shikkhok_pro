// src/app/api/organizations/verify-slug/route.ts
// GET /api/organizations/verify-slug?slug=abc-school

import { NextRequest } from 'next/server';
import { successResponse, errorResponse } from '@/lib/org/response';
import { OrgApiError } from '@/lib/org/errors';
import { isSlugAvailable } from '@/lib/org/slug';

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('slug');

    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      throw new OrgApiError(400, 'INVALID_SLUG', 'Slug parameter is required');
    }

    const available = await isSlugAvailable(slug);

    return successResponse({
      available,
      slug: slug.toLowerCase(),
    });
  } catch (error) {
    if (error instanceof OrgApiError) {
      return errorResponse(error);
    }
    console.error('[GET /api/organizations/verify-slug] error:', error);
    return errorResponse(
      error instanceof Error ? error : new Error('Unknown error'),
    );
  }
}
