// src/components/org/OrgMembersList.tsx
'use client';

import { useState } from 'react';
import { useOrgMembers } from '@/hooks/useOrgMembers';
import { OrgMemberItem } from './OrgMemberItem';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { ErrorAlert } from './ErrorAlert';
import type { OrgRole } from '@/types/organization';

interface OrgMembersListProps {
  orgId: string;
  roleFilter?: OrgRole;
  canManage?: boolean;
}

export function OrgMembersList({
  orgId,
  roleFilter,
  canManage = false,
}: OrgMembersListProps) {
  const { members, loading, error, refetch } = useOrgMembers(orgId, roleFilter);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const res = await fetch(`/api/organizations/${orgId}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to remove member');
      }

      await refetch();
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert error={error} />;
  if (members.length === 0) {
    return (
      <EmptyState
        icon="👥"
        title="No Members Yet"
        description="This organization doesn't have any members yet."
      />
    );
  }

  return (
    <div className="space-y-3">
      <ErrorAlert
        error={localError}
        onDismiss={() => setLocalError(null)}
      />
      {members.map((member) => (
        <OrgMemberItem
          key={member.id}
          member={member}
          canManage={canManage}
          onRemove={
            canManage ? () => handleRemoveMember(member.id) : undefined
          }
        />
      ))}
    </div>
  );
}
