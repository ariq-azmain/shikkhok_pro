
// src/lib/org/auth.ts
import { auth } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { User } from '@/types/organization';
import { OrgApiError, ORG_ERRORS } from './errors';

export async function getAuthenticatedUser(): Promise<User> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new OrgApiError(
      ORG_ERRORS.UNAUTHORIZED.statusCode,
      ORG_ERRORS.UNAUTHORIZED.code,
      ORG_ERRORS.UNAUTHORIZED.message,
    );
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerkId', clerkId)
    .single();

  if (error || !data) {
    console.error('[getAuthenticatedUser] DB error:', error);
    throw new OrgApiError(
      ORG_ERRORS.USER_NOT_FOUND.statusCode,
      ORG_ERRORS.USER_NOT_FOUND.code,
      ORG_ERRORS.USER_NOT_FOUND.message,
    );
  }

  return data;
}

export async function verifyTeacherAccount(user: User): Promise<void> {
  if (user.accountType !== 'TEACHER') {
    throw new OrgApiError(
      ORG_ERRORS.NOT_TEACHER.statusCode,
      ORG_ERRORS.NOT_TEACHER.code,
      ORG_ERRORS.NOT_TEACHER.message,
    );
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('[getUserById] DB error:', error);
    throw new OrgApiError(500, ORG_ERRORS.DB_ERROR.code, ORG_ERRORS.DB_ERROR.message);
  }

  return data || null;
}