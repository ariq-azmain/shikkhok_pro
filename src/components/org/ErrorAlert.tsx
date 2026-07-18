// src/components/org/ErrorAlert.tsx
'use client';

interface ErrorAlertProps {
  error: string | null;
  onDismiss?: () => void;
}

export function ErrorAlert({ error, onDismiss }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-start gap-3 mb-4">
      <span className="text-xl leading-none">⚠️</span>
      <div className="flex-1">
        <p className="text-red-400 font-medium">Error</p>
        <p className="text-red-300/80 text-sm mt-1">{error}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}
