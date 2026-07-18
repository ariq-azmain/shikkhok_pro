// src/components/org/LoadingSpinner.tsx
'use client';

export function LoadingSpinner() {
  return (
    <div className="org-loading">
      <div className="w-4 h-4 rounded-full border-2 border-text-secondary border-t-indigo-500 animate-spin"></div>
      <span>Loading...</span>
    </div>
  );
}
