// src/hooks/useOrgDashboard.ts
'use client';

import { useEffect, useState } from 'react';
import type { OrgDashboardData } from '@/types/organization';

interface UseOrgDashboardResult {
  dashboard: OrgDashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrgDashboard(orgId: string): UseOrgDashboardResult {
  const [dashboard, setDashboard] = useState<OrgDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/organizations/${orgId}/dashboard`);
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard');
      }

      const data = await res.json();
      setDashboard(data.data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('[useOrgDashboard] error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orgId) return;
    fetchDashboard();
  }, [orgId]);

  return {
    dashboard,
    loading,
    error,
    refetch: fetchDashboard,
  };
}
