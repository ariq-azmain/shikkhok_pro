
// src/lib/org/errors.ts
export class OrgApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'OrgApiError';
    Object.setPrototypeOf(this, OrgApiError.prototype);
  }
}

export const ORG_ERRORS = {
  UNAUTHORIZED: {
    statusCode: 401,
    code: 'UNAUTHORIZED',
    message: 'Not authenticated',
  },
  FORBIDDEN: {
    statusCode: 403,
    code: 'FORBIDDEN',
    message: 'You do not have permission to perform this action',
  },
  ORG_NOT_FOUND: {
    statusCode: 404,
    code: 'ORG_NOT_FOUND',
    message: 'Organization not found',
  },
  ORG_INVALID_NAME: {
    statusCode: 400,
    code: 'ORG_INVALID_NAME',
    message: 'Organization name is required and must be 1-255 characters',
  },
  ORG_INVALID_TYPE: {
    statusCode: 400,
    code: 'ORG_INVALID_TYPE',
    message: 'Invalid organization type. Must be SCHOOL, COLLEGE, COACHING, MADRASA, or OTHER',
  },
  ORG_SLUG_TAKEN: {
    statusCode: 409,
    code: 'ORG_SLUG_TAKEN',
    message: 'Organization slug is already in use',
  },
  MEMBER_NOT_FOUND: {
    statusCode: 404,
    code: 'MEMBER_NOT_FOUND',
    message: 'Member not found in organization',
  },
  MEMBER_EXISTS: {
    statusCode: 409,
    code: 'MEMBER_EXISTS',
    message: 'User is already a member of this organization',
  },
  CANNOT_REMOVE_PRINCIPAL: {
    statusCode: 400,
    code: 'CANNOT_REMOVE_PRINCIPAL',
    message: 'Cannot remove organization principal',
  },
  USER_NOT_FOUND: {
    statusCode: 404,
    code: 'USER_NOT_FOUND',
    message: 'User not found',
  },
  NOT_TEACHER: {
    statusCode: 400,
    code: 'NOT_TEACHER',
    message: 'Only teacher accounts can create organizations',
  },
  INVALID_ROLE: {
    statusCode: 400,
    code: 'INVALID_ROLE',
    message: 'Invalid role specified. Must be ORG_TEACHER or ORG_ADMIN',
  },
  DB_ERROR: {
    statusCode: 500,
    code: 'DB_ERROR',
    message: 'Database operation failed',
  },
  INTERNAL_ERROR: {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'Internal server error',
  },
} as const;