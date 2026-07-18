// src/app/org/create/page.tsx
'use client';

import { CreateOrgForm } from '@/components/org/CreateOrgForm';

export default function CreateOrgPage() {
  return (
    <div className="page-bg min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Create Organization
        </h1>
        <p className="text-text-secondary mb-8">
          Start managing your school or organization with Shikkhok Pro
        </p>

        <div className="org-card">
          <CreateOrgForm />
        </div>
      </div>
    </div>
  );
}
