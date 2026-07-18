// src/hooks/useOrganization.ts
'use client';

import { useEffect, useState } from 'react';
import type { Organization, OrgWithMembers, OrgStats } from '@/types/organization';
import { OrgApiError } from '@/lib/org/errors';

interface UseOrganizationResult {
  org: OrgWithMembers | null;
  stats: OrgStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrganization(orgId: string): UseOrganizationResult {
  const [org, setOrg] = useState<OrgWithMembers | null>(null);
  const [stats, setStats] = useState<OrgStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrg = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/organizations/${orgId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch organization');
      }

      const data = await res.json();
      setOrg(data.data);
      setStats(data.data.stats);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('[useOrganization] error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orgId) return;
    fetchOrg();
  }, [orgId]);

  return {
    org,
    stats,
    loading,
    error,
    refetch: fetchOrg,
  };
}
