import React from "react";

// OrgList shows owned orgs first and other member orgs below
export default function OrgList({ orgsOwned, orgsMember }: any) {
  // Filter out owned orgs from member list to avoid duplication
  const ownedIds = new Set((orgsOwned || []).map((o: any) => o.id));
  const memberOnly = (orgsMember || []).filter((o: any) => !ownedIds.has(o.id));

  return (
    <div className="space-y-2">
      {orgsOwned && orgsOwned.length > 0 && (
        <div>
          <p className="text-xs font-semibold mb-2">Owned</p>
          <div className="space-y-2">
            {orgsOwned.map((o: any) => (
              <div key={o.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted-10 flex items-center justify-center text-sm">{o.name?.[0]}</div>
                <div>
                  <div className="font-medium">{o.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{o.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-semibold mb-2">Member</p>
        <div className="space-y-2">
          {memberOnly && memberOnly.length > 0 ? (
            memberOnly.map((o: any) => (
              <div key={o.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-muted-10 flex items-center justify-center text-sm">{o.name?.[0]}</div>
                <div>
                  <div className="font-medium">{o.name}</div>
                  <div className="text-xs text-[var(--text-muted)]">{o.role}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--text-muted)]">No organizations found</p>
          )}
        </div>
      </div>
    </div>
  );
}
