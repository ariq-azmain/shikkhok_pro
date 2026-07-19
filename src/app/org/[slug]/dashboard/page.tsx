// src/app/org/[slug]/dashboard/page.tsx
'use client';

import { Suspense, useState } from 'react';
import { useOrgDashboard } from '@/hooks/useOrgDashboard';
import { OrgStats } from '@/components/org/OrgStats';
import { OrgMembersList } from '@/components/org/OrgMembersList';
import { AddMemberForm } from '@/components/org/AddMemberForm';
import { LoadingSpinner } from '@/components/org/LoadingSpinner';
import { ErrorAlert } from '@/components/org/ErrorAlert';
import { canManageMembers, ORG_TYPE_LABELS } from '@/lib/org/client-utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function DashboardContent({ slug }: { slug: string }) {
  const [showAddMember, setShowAddMember] = useState(false);
  const { dashboard, loading, error, refetch } = useOrgDashboard(slug);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert error={error} />;
  }

  if (!dashboard) {
    return <ErrorAlert error="Organization not found" />;
  }

  const canManage = canManageMembers(dashboard.userRole);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="org-card">
        <div className="flex items-start gap-4 mb-6">
          {dashboard.organization.logo ? (
            <img
              src={dashboard.organization.logo}
              alt={dashboard.organization.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white">
              {dashboard.organization.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {dashboard.organization.name}
            </h1>
            <p className="text-text-secondary">
              {ORG_TYPE_LABELS[dashboard.organization.type]}
            </p>
            {dashboard.organization.description && (
              <p className="text-text-muted mt-2">
                {dashboard.organization.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      {dashboard.stats && <OrgStats stats={dashboard.stats} />}

      {/* Members Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-text-primary">Members</h2>
          {canManage && (
            <button
              onClick={() => setShowAddMember(!showAddMember)}
              className="org-button-primary"
            >
              {showAddMember ? '✕ Cancel' : '➕ Add Member'}
            </button>
          )}
        </div>

        {showAddMember && canManage && (
          <AddMemberForm
            orgId={dashboard.organization.id}
            onSuccess={() => {
              setShowAddMember(false);
              refetch();
            }}
          />
        )}

        <OrgMembersList
          orgId={dashboard.organization.id}
          canManage={canManage}
        />
      </div>

      {/* Teacher-specific view */}
      {dashboard.myProfile && (
        <div className="org-card">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Your Profile
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Name</p>
              <p className="text-text-primary font-medium">
                {dashboard.myProfile.displayName}
              </p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Email</p>
              <p className="text-text-primary font-medium">
                {dashboard.myProfile.email}
              </p>
            </div>
            {dashboard.myProfile.subjects.length > 0 && (
              <div>
                <p className="text-sm text-text-secondary">Subjects</p>
                <p className="text-text-primary font-medium">
                  {dashboard.myProfile.subjects.join(', ')}
                </p>
              </div>
            )}
            {dashboard.myProfile.classes.length > 0 && (
              <div>
                <p className="text-sm text-text-secondary">Classes</p>
                <p className="text-text-primary font-medium">
                  {dashboard.myProfile.classes.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Stats (Teacher view) */}
      {dashboard.myStats && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">My Statistics</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="org-stat">
              <div className="org-stat-value">{dashboard.myStats.myQuestions}</div>
              <div className="org-stat-label">Questions Created</div>
            </div>
            <div className="org-stat">
              <div className="org-stat-value">{dashboard.myStats.assignedTasks}</div>
              <div className="org-stat-label">Assigned Tasks</div>
            </div>
            <div className="org-stat">
              <div className="org-stat-value">{dashboard.myStats.pendingTasks}</div>
              <div className="org-stat-label">Pending Tasks</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default async function OrgDashboardPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="page-bg min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardContent slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}