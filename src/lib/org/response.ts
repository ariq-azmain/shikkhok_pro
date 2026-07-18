
// src/lib/org/response.ts
import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types/organization';
import { OrgApiError } from './errors';

export function successResponse<T>(
  data: T,
  statusCode: number = 200,
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    } as ApiResponse<T>,
    { status: statusCode },
  );
}

export function errorResponse(
  error: OrgApiError | Error,
  defaultStatusCode: number = 500,
): NextResponse<ApiResponse<null>> {
  if (error instanceof OrgApiError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      } as ApiResponse<null>,
      { status: error.statusCode },
    );
  }

  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error('[Organization API Error]', message);

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    } as ApiResponse<null>,
    { status: defaultStatusCode },
  );
}
