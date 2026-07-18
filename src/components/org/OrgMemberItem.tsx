// src/components/org/OrgMemberItem.tsx
'use client';

import { ORG_ROLE_LABELS, ORG_ROLE_COLORS } from '@/lib/org/client-utils';
import type { OrgMemberWithUser } from '@/types/organization';

interface OrgMemberItemProps {
  member: OrgMemberWithUser;
  onRemove?: () => void;
  onUpdate?: () => void;
  canManage?: boolean;
}

export function OrgMemberItem({
  member,
  onRemove,
  onUpdate,
  canManage = false,
}: OrgMemberItemProps) {
  return (
    <div className="org-card flex items-center justify-between">
      {/* User Info */}
      <div className="flex items-center gap-3 flex-1">
        <div className="org-member-avatar">
          {member.user.displayName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-text-primary truncate">
              {member.user.displayName}
            </h4>
            <span
              className={`org-badge-role text-xs ${ORG_ROLE_COLORS[member.role]}`}
            >
              {ORG_ROLE_LABELS[member.role]}
            </span>
          </div>
          <p className="text-sm text-text-secondary truncate">
            {member.user.email}
          </p>
          {member.subjects.length > 0 && (
            <p className="text-xs text-text-muted mt-1">
              {member.subjects.join(', ')} • {member.classes.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      {canManage && (onUpdate || onRemove) && (
        <div className="flex items-center gap-2 ml-4">
          {onUpdate && (
            <button
              onClick={onUpdate}
              className="p-2 hover:bg-muted-10 rounded-lg transition-colors text-text-secondary hover:text-text-primary"
            >
              ✏️
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-text-secondary hover:text-red-400"
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
}
