// src/hooks/useOrgMembers.ts
'use client';

import { useEffect, useState } from 'react';
import type { OrgMemberWithUser, OrgRole } from '@/types/organization';

interface UseOrgMembersResult {
  members: OrgMemberWithUser[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrgMembers(
  orgId: string,
  roleFilter?: OrgRole,
): UseOrgMembersResult {
  const [members, setMembers] = useState<OrgMemberWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/organizations/${orgId}/members`;
      if (roleFilter) {
        url += `?role=${roleFilter}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch members');
      }

      const data = await res.json();
      setMembers(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('[useOrgMembers] error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orgId) return;
    fetchMembers();
  }, [orgId, roleFilter]);

  return {
    members,
    loading,
    error,
    refetch: fetchMembers,
  };
}
