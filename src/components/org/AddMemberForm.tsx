// src/components/org/AddMemberForm.tsx
'use client';

import { useState } from 'react';
import { ErrorAlert } from './ErrorAlert';
import { LoadingSpinner } from './LoadingSpinner';
import type { OrgRole } from '@/types/organization';

interface AddMemberFormProps {
  orgId: string;
  onSuccess?: () => void;
}

const ROLES: { value: Exclude<OrgRole, 'ORG_PRINCIPAL'>; label: string }[] = [
  { value: 'ORG_TEACHER', label: 'Teacher' },
  { value: 'ORG_ADMIN', label: 'Admin' },
];

export function AddMemberForm({ orgId, onSuccess }: AddMemberFormProps) {
  const [formData, setFormData] = useState({
    userId: '',
    role: 'ORG_TEACHER' as Exclude<OrgRole, 'ORG_PRINCIPAL'>,
    subjects: '',
    classes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.userId.trim()) {
      setError('User ID is required');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/organizations/${orgId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.userId,
          role: formData.role,
          subjects: formData.subjects
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          classes: formData.classes
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to add member');
      }

      setFormData({
        userId: '',
        role: 'ORG_TEACHER',
        subjects: '',
        classes: '',
      });

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 org-card">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Add Member</h3>

      <ErrorAlert error={error} onDismiss={() => setError(null)} />

      {/* User ID */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          User ID *
        </label>
        <input
          type="text"
          className="org-input"
          placeholder="Enter user ID..."
          value={formData.userId}
          onChange={(e) =>
            setFormData({ ...formData, userId: e.target.value })
          }
          disabled={loading}
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Role *
        </label>
        <select
          className="org-input"
          value={formData.role}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value as Exclude<OrgRole, 'ORG_PRINCIPAL'>,
            })
          }
          disabled={loading}
        >
          {ROLES.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subjects */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Subjects (comma-separated)
        </label>
        <input
          type="text"
          className="org-input"
          placeholder="e.g., Math, Physics, Chemistry"
          value={formData.subjects}
          onChange={(e) =>
            setFormData({ ...formData, subjects: e.target.value })
          }
          disabled={loading}
        />
      </div>

      {/* Classes */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Classes (comma-separated)
        </label>
        <input
          type="text"
          className="org-input"
          placeholder="e.g., Class 9, Class 10, HSC"
          value={formData.classes}
          onChange={(e) =>
            setFormData({ ...formData, classes: e.target.value })
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
            Adding...
          </>
        ) : (
          'Add Member'
        )}
      </button>
    </form>
  );
}
