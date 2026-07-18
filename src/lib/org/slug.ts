
// src/lib/org/slug.ts
import { supabaseAdmin } from '@/lib/supabase/admin';
import { OrgApiError, ORG_ERRORS } from './errors';

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function generateUniqueSlug(name: string): Promise<string> {
  let slug = createSlug(name);

  if (!slug) {
    slug = `org-${Date.now()}`;
  }

  const { data: existing, error } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[generateUniqueSlug] DB error:', error);
    throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
  }

  if (!existing) {
    return slug;
  }

  let counter = 1;
  let uniqueSlug = `${slug}-${counter}`;

  while (true) {
    const { data: conflicting, error: err } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .eq('slug', uniqueSlug)
      .maybeSingle();

    if (err) {
      console.error('[generateUniqueSlug] DB error:', err);
      throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
    }

    if (!conflicting) {
      return uniqueSlug;
    }

    counter++;
    uniqueSlug = `${slug}-${counter}`;
  }
}

export async function isSlugAvailable(slug: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('organizations')
    .select('id')
    .eq('slug', slug.toLowerCase())
    .maybeSingle();

  if (error) {
    console.error('[isSlugAvailable] DB error:', error);
    throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
  }

  return !data;
}
