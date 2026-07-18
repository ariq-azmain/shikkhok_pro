// src/hooks/useCreateOrganization.ts
'use client';

import { useState } from 'react';
import type { CreateOrgPayload, OrgWithMembers } from '@/types/organization';

interface UseCreateOrgResult {
  create: (payload: CreateOrgPayload) => Promise<OrgWithMembers>;
  loading: boolean;
  error: string | null;
}

export function useCreateOrganization(): UseCreateOrgResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (payload: CreateOrgPayload): Promise<OrgWithMembers> => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Failed to create organization');
      }

      const data = await res.json();
      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}
