import React from "react";

export default function TasksByOrg({ tasksByOrg }: any) {
  const orgKeys = Object.keys(tasksByOrg || {});
  if (orgKeys.length === 0) return <p className="text-sm text-muted">No assigned tasks.</p>;

  return (
    <div className="space-y-4">
      {orgKeys.map((orgId) => {
        const entry = tasksByOrg[orgId];
        const counts = entry.tasks.reduce((acc: any, t: any) => {
          acc[t.status] = (acc[t.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        return (
          <div key={orgId} className="border rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{entry.org?.name ?? "Organization"}</div>
              <div className="text-sm text-muted">{entry.tasks.length} tasks</div>
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
              {entry.tasks.slice(0, 6).map((t: any) => (
                <div key={t.id} className="p-2 rounded-md bg-white/3">
                  <div className="font-medium text-sm">{t.title}</div>
                  <div className="text-xs text-muted">{t.status}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted">Status counts: {JSON.stringify(counts)}</div>
          </div>
        );
      })}
    </div>
  );
}
