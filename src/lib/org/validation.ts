
// src/lib/org/validation.ts
import type { OrgRole, OrgType, CreateOrgPayload, UpdateOrgPayload, AddMemberPayload, UpdateMemberPayload } from '@/types/organization';
import { OrgApiError, ORG_ERRORS } from './errors';

const VALID_ORG_TYPES: OrgType[] = ['SCHOOL', 'COLLEGE', 'COACHING', 'MADRASA', 'OTHER'];
const VALID_ORG_ROLES: OrgRole[] = ['ORG_PRINCIPAL', 'ORG_ADMIN', 'ORG_TEACHER'];
const ASSIGNABLE_ROLES: Exclude<OrgRole, 'ORG_PRINCIPAL'>[] = ['ORG_TEACHER', 'ORG_ADMIN'];

export function validateOrgType(type: unknown): OrgType {
  if (typeof type !== 'string' || !VALID_ORG_TYPES.includes(type as OrgType)) {
    throw new OrgApiError(
      ORG_ERRORS.ORG_INVALID_TYPE.statusCode,
      ORG_ERRORS.ORG_INVALID_TYPE.code,
      ORG_ERRORS.ORG_INVALID_TYPE.message,
    );
  }
  return type as OrgType;
}

export function validateOrgName(name: unknown): string {
  if (typeof name !== 'string') {
    throw new OrgApiError(
      ORG_ERRORS.ORG_INVALID_NAME.statusCode,
      ORG_ERRORS.ORG_INVALID_NAME.code,
      ORG_ERRORS.ORG_INVALID_NAME.message,
    );
  }

  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > 255) {
    throw new OrgApiError(
      ORG_ERRORS.ORG_INVALID_NAME.statusCode,
      ORG_ERRORS.ORG_INVALID_NAME.code,
      ORG_ERRORS.ORG_INVALID_NAME.message,
    );
  }

  return trimmed;
}

export function validateOrgRole(role: unknown): OrgRole {
  if (typeof role !== 'string' || !VALID_ORG_ROLES.includes(role as OrgRole)) {
    throw new OrgApiError(
      ORG_ERRORS.INVALID_ROLE.statusCode,
      ORG_ERRORS.INVALID_ROLE.code,
      ORG_ERRORS.INVALID_ROLE.message,
    );
  }
  return role as OrgRole;
}

export function validateAssignableRole(role: unknown): Exclude<OrgRole, 'ORG_PRINCIPAL'> {
  if (typeof role !== 'string' || !ASSIGNABLE_ROLES.includes(role as Exclude<OrgRole, 'ORG_PRINCIPAL'>)) {
    throw new OrgApiError(
      ORG_ERRORS.INVALID_ROLE.statusCode,
      ORG_ERRORS.INVALID_ROLE.code,
      ORG_ERRORS.INVALID_ROLE.message,
    );
  }
  return role as Exclude<OrgRole, 'ORG_PRINCIPAL'>;
}

export function validateCreateOrgPayload(payload: unknown): CreateOrgPayload {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Invalid payload');
  }

  const typed = payload as Record<string, unknown>;

  return {
    name: validateOrgName(typed.name),
    type: validateOrgType(typed.type),
    description: typeof typed.description === 'string' ? typed.description.trim() : undefined,
    address: typeof typed.address === 'string' ? typed.address.trim() : undefined,
    logo: typeof typed.logo === 'string' ? typed.logo : undefined,
    slug: typeof typed.slug === 'string' ? typed.slug.trim() : undefined,
  };
}

export function validateUpdateOrgPayload(payload: unknown): UpdateOrgPayload {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Invalid payload');
  }

  const typed = payload as Record<string, unknown>;
  const result: UpdateOrgPayload = {};

  if ('name' in typed) {
    result.name = validateOrgName(typed.name);
  }
  if ('description' in typed) {
    result.description = typed.description === null ? null : typeof typed.description === 'string' ? typed.description.trim() : undefined;
  }
  if ('address' in typed) {
    result.address = typed.address === null ? null : typeof typed.address === 'string' ? typed.address.trim() : undefined;
  }
  if ('logo' in typed) {
    result.logo = typed.logo === null ? null : typeof typed.logo === 'string' ? typed.logo : undefined;
  }

  return result;
}

export function validateAddMemberPayload(payload: unknown): AddMemberPayload {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Invalid payload');
  }

  const typed = payload as Record<string, unknown>;

  if (typeof typed.userId !== 'string' || !typed.userId) {
    throw new OrgApiError(400, 'INVALID_INPUT', 'User ID is required');
  }

  return {
    userId: typed.userId,
    role: validateAssignableRole(typed.role),
    subjects: Array.isArray(typed.subjects) ? (typed.subjects as string[]) : [],
    classes: Array.isArray(typed.classes) ? (typed.classes as string[]) : [],
  };
}

export function validateUpdateMemberPayload(payload: unknown): UpdateMemberPayload {
  if (typeof payload !== 'object' || payload === null) {
    throw new Error('Invalid payload');
  }

  const typed = payload as Record<string, unknown>;
  const result: UpdateMemberPayload = {};

  if ('role' in typed) {
    result.role = validateAssignableRole(typed.role);
  }
  if ('subjects' in typed) {
    result.subjects = Array.isArray(typed.subjects) ? (typed.subjects as string[]) : [];
  }
  if ('classes' in typed) {
    result.classes = Array.isArray(typed.classes) ? (typed.classes as string[]) : [];
  }

  return result;
}
