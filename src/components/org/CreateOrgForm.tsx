// src/components/org/CreateOrgForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateOrganization } from '@/hooks/useCreateOrganization';
import { ErrorAlert } from './ErrorAlert';
import { LoadingSpinner } from './LoadingSpinner';
import type { OrgType } from '@/types/organization';

const ORG_TYPES: { value: OrgType; label: string }[] = [
  { value: 'SCHOOL', label: '🏫 School' },
  { value: 'COLLEGE', label: '🎓 College' },
  { value: 'COACHING', label: '📚 Coaching Center' },
  { value: 'MADRASA', label: '🕌 Madrasa' },
  { value: 'OTHER', label: '🏢 Other' },
];

export function CreateOrgForm() {
  const router = useRouter();
  const { create, loading, error } = useCreateOrganization();

  const [formData, setFormData] = useState({
    name: '',
    type: 'SCHOOL' as OrgType,
    description: '',
    address: '',
  });

  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!formData.name.trim()) {
      setLocalError('Organization name is required');
      return;
    }

    try {
      const org = await create(formData);
      router.push(`/org/${org.slug}/dashboard`);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to create organization');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <ErrorAlert error={localError || error} onDismiss={() => setLocalError(null)} />

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Organization Name *
        </label>
        <input
          type="text"
          className="org-input"
          placeholder="e.g., My School"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          disabled={loading}
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Organization Type *
        </label>
        <select
          className="org-input"
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as OrgType })
          }
          disabled={loading}
        >
          {ORG_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Description
        </label>
        <textarea
          className="org-input resize-none"
          placeholder="Brief description of your organization..."
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          disabled={loading}
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Address
        </label>
        <input
          type="text"
          className="org-input"
          placeholder="Organization address..."
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          disabled={loading}
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="org-button-primary w-full"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            Creating...
          </>
        ) : (
          'Create Organization'
        )}
      </button>
    </form>
  );
}
