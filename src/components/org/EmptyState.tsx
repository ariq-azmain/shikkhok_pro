// src/components/org/EmptyState.tsx
'use client';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="org-empty-state">
      <div className="org-empty-icon">{icon}</div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}
