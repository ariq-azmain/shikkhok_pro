// src/components/org/OrgCard.tsx
'use client';

import Link from 'next/link';
import { ORG_TYPE_LABELS } from '@/lib/org/client-utils';
import type { Organization } from '@/types/organization';

interface OrgCardProps {
  org: Organization & { role: string; memberCount?: number };
}

export function OrgCard({ org }: OrgCardProps) {
  return (
    <Link href={`/org/${org.slug}/dashboard`}>
      <div className="org-card-hover group">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-lg font-bold text-white">
            {org.name.charAt(0).toUpperCase()}
          </div>
          <span className="org-badge-role bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-xs">
            {org.role}
          </span>
        </div>

        {/* Name & Type */}
        <h3 className="text-base font-semibold text-text-primary group-hover:text-indigo-400 transition-colors mb-1">
          {org.name}
        </h3>
        <p className="text-sm text-text-secondary mb-3">
          {ORG_TYPE_LABELS[org.type]}
        </p>

        {/* Description */}
        {org.description && (
          <p className="text-sm text-text-muted line-clamp-2 mb-3">
            {org.description}
          </p>
        )}

        {/* Footer Stats */}
        {org.memberCount !== undefined && (
          <div className="flex items-center gap-2 text-xs text-text-secondary border-t border-muted-10 pt-3">
            <span>👥 {org.memberCount} members</span>
          </div>
        )}
      </div>
    </Link>
  );
}
