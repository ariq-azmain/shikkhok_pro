// src/components/org/OrgStats.tsx
'use client';

import type { OrgStats } from '@/types/organization';

interface OrgStatsProps {
  stats: OrgStats;
}

export function OrgStats({ stats }: OrgStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="org-stat">
        <div className="org-stat-value">{stats.totalMembers}</div>
        <div className="org-stat-label">Total Members</div>
      </div>
      <div className="org-stat">
        <div className="org-stat-value">{stats.principals}</div>
        <div className="org-stat-label">Principals</div>
      </div>
      <div className="org-stat">
        <div className="org-stat-value">{stats.admins}</div>
        <div className="org-stat-label">Admins</div>
      </div>
      <div className="org-stat">
        <div className="org-stat-value">{stats.teachers}</div>
        <div className="org-stat-label">Teachers</div>
      </div>
    </div>
  );
}
